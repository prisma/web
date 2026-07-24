"use client"

import * as React from "react"
import { UploadIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type FileUploadProps = {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onFilesChange?: (files: File[]) => void
  disabled?: boolean
  className?: string
}

function FileUpload({
  accept,
  multiple = false,
  maxSize,
  onFilesChange,
  disabled = false,
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([])
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleFiles(incoming: FileList | null) {
    if (!incoming) return
    const valid = Array.from(incoming).filter(
      (f) => !maxSize || f.size <= maxSize
    )
    const next = multiple ? [...files, ...valid] : valid.slice(0, 1)
    setFiles(next)
    onFilesChange?.(next)
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index)
    setFiles(next)
    onFilesChange?.(next)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        data-slot="file-upload-dropzone"
        data-drag-active={dragActive || undefined}
        className={cn(
          "relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          "hover:border-primary/50 hover:bg-accent/50",
          "data-[drag-active]:border-primary data-[drag-active]:bg-accent/50",
          disabled && "pointer-events-none opacity-50"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFiles(e.dataTransfer.files)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <UploadIcon className="mb-2 size-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drop files here or click to upload
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {accept ? `Accepted: ${accept}` : "Any file type"}
          {maxSize && ` · Max ${(maxSize / 1024 / 1024).toFixed(0)}MB`}
        </p>
      </div>

      {files.length > 0 && (
        <ul data-slot="file-upload-list" className="space-y-1">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Remove ${file.name}`}
                className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { FileUpload }
export type { FileUploadProps }
