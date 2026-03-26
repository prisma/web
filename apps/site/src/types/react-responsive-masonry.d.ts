declare module "react-responsive-masonry" {
  import { ReactNode } from "react";

  export interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>;
    children?: ReactNode;
  }

  export interface MasonryProps {
    columnsCount?: number;
    gutter?: string;
    children?: ReactNode;
    center?: boolean;
  }

  export class ResponsiveMasonry extends React.Component<ResponsiveMasonryProps> {}
  export default class Masonry extends React.Component<MasonryProps> {}
}
