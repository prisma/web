"use client";

import {
  Children,
  isValidElement,
  useId,
  useLayoutEffect,
  useMemo,
  type ComponentProps,
} from "react";
import { CodeBlockTabs } from "@prisma/eclipse";
import { useDatabaseSelection } from "@/components/database-provider";
import {
  databaseFromTabValue,
  getDatabaseTabValue,
  normalizeDatabase,
  type Database,
} from "@/lib/database-selection";

export function DatabaseCodeTabs(props: ComponentProps<typeof CodeBlockTabs>) {
  const { database, selectDatabase, registerGroup } = useDatabaseSelection();
  const id = useId();
  const values = useMemo(
    () =>
      Children.toArray(props.children).flatMap((child) => {
        if (!isValidElement<{ value?: string }>(child)) return [];
        return typeof child.props.value === "string" ? [child.props.value] : [];
      }),
    [props.children],
  );
  // Only groups whose panels are all databases participate. Other code tabs
  // keep their own value, groupId and persistence behavior.
  const databases = useMemo(
    () => values.map(normalizeDatabase).filter((value): value is Database => value !== null),
    [values],
  );
  const isDatabaseGroup =
    values.length > 0 && databases.length === values.length && !props.variants;

  useLayoutEffect(() => {
    if (isDatabaseGroup) return registerGroup(id, databases);
  }, [id, isDatabaseGroup, databases, registerGroup]);

  if (!isDatabaseGroup) return <CodeBlockTabs {...props} />;

  return (
    <CodeBlockTabs
      {...props}
      groupId={undefined}
      persist={false}
      updateAnchor={false}
      value={getDatabaseTabValue(values, database, props.defaultValue)}
      onValueChange={(value) => {
        const selected = databaseFromTabValue(value, values);
        if (selected) selectDatabase(selected);
        props.onValueChange?.(value);
      }}
    />
  );
}
