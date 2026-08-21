"use client";

import { useState } from "react";
import {
  DatePickerSingle,
  DatePickerRange,
  createDateRangePresets,
} from "@prisma/eclipse";
import type { DateRange } from "@prisma/eclipse";

export function DatePickerSingleExample() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePickerSingle
      date={date}
      onDateChange={setDate}
      placeholder="Select a date"
      dateFormat="dd/MM/yyyy"
    />
  );
}

export function DatePickerRangeExample() {
  const [dateRange, setDateRange] = useState<DateRange>();

  return (
    <DatePickerRange
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      placeholder="Pick a date range"
    />
  );
}

export function DatePickerRangeWithPresetsExample() {
  const [dateRange, setDateRange] = useState<DateRange>();
  const presets = createDateRangePresets();

  return (
    <DatePickerRange
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      presets={presets}
      placeholder="Pick a date range with presets"
    />
  );
}

export function DatePickerErrorExample() {
  return (
    <div className="space-y-2">
      <DatePickerSingle placeholder="Error state example" isErrored={true} />
      <p className="text-sm text-foreground-error">Date is required</p>
    </div>
  );
}

export function DatePickerDisabledExample() {
  return (
    <DatePickerSingle placeholder="Disabled state example" disabledBtn={true} />
  );
}

export function DatePickerWithValidationExample() {
  const [date, setDate] = useState<Date>();
  const [submitted, setSubmitted] = useState(false);

  const hasError = submitted && !date;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (date) {
      alert(`Date selected: ${date.toLocaleDateString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Event Date *</label>
        <DatePickerSingle
          date={date}
          onDateChange={(newDate) => {
            setDate(newDate);
            if (newDate) setSubmitted(false);
          }}
          placeholder="Select event date"
          isErrored={hasError}
        />
        {hasError && (
          <p className="text-sm text-foreground-error">
            Please select an event date
          </p>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-background-ppg text-foreground-ppg rounded-md hover:bg-background-ppg/90"
      >
        Submit
      </button>
    </form>
  );
}
