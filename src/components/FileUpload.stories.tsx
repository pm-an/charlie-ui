import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload, type FileUploadFile } from "./FileUpload";
import { Field } from "./Field";
import { ImageIcon } from "lucide-react";

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["dropzone", "button"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    showFileList: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: function FileUploadStory() {
    const [files, setFiles] = React.useState<FileUploadFile[]>([]);

    const handleChange = (newFiles: File[]) => {
      const uploadFiles: FileUploadFile[] = newFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        progress: 0,
        status: "idle" as const,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));
      setFiles((prev) => [...prev, ...uploadFiles]);
    };

    const handleRemove = (fileId: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    return (
      <div className="p-6 max-w-lg">
        <FileUpload
          onChange={handleChange}
          value={files}
          onRemove={handleRemove}
          description="PNG, JPG, PDF up to 10MB"
        />
      </div>
    );
  },
};

export const ButtonVariant: Story = {
  render: function FileUploadButtonStory() {
    const [files, setFiles] = React.useState<FileUploadFile[]>([]);

    const handleChange = (newFiles: File[]) => {
      const uploadFiles: FileUploadFile[] = newFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        progress: 0,
        status: "idle" as const,
      }));
      setFiles((prev) => [...prev, ...uploadFiles]);
    };

    const handleRemove = (fileId: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    return (
      <div className="p-6 max-w-lg">
        <FileUpload
          variant="button"
          onChange={handleChange}
          value={files}
          onRemove={handleRemove}
        />
      </div>
    );
  },
};

export const ImageOnly: Story = {
  args: {
    accept: "image/*",
    label: "Upload images",
    description: "PNG, JPG, GIF, WebP accepted",
    icon: <ImageIcon className="h-10 w-10 text-white/60" />,
  },
  render: function ImageOnlyStory(args) {
    return (
      <div className="p-6 max-w-lg">
        <FileUpload {...args} />
      </div>
    );
  },
};

export const WithMaxSize: Story = {
  args: {
    maxSize: 5 * 1024 * 1024,
    description: "Max file size: 5MB",
  },
  render: function MaxSizeStory(args) {
    return (
      <div className="p-6 max-w-lg">
        <FileUpload {...args} />
      </div>
    );
  },
};

export const WithMaxFiles: Story = {
  render: function MaxFilesStory() {
    const [files, setFiles] = React.useState<FileUploadFile[]>([]);

    const handleChange = (newFiles: File[]) => {
      const uploadFiles: FileUploadFile[] = newFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        file,
        progress: 0,
        status: "idle" as const,
      }));
      setFiles((prev) => [...prev, ...uploadFiles]);
    };

    const handleRemove = (fileId: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    return (
      <div className="p-6 max-w-lg">
        <FileUpload
          maxFiles={3}
          onChange={handleChange}
          value={files}
          onRemove={handleRemove}
          description="Maximum 3 files allowed"
        />
      </div>
    );
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    description: "Compact upload zone",
  },
  render: function SmallSizeStory(args) {
    return (
      <div className="p-6 max-w-lg">
        <FileUpload {...args} />
      </div>
    );
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    description: "Drag and drop your files here",
  },
  render: function LargeSizeStory(args) {
    return (
      <div className="p-6 max-w-lg">
        <FileUpload {...args} />
      </div>
    );
  },
};

const createMockFile = (name: string, size: number, type: string): File => {
  const blob = new Blob(["x".repeat(Math.min(size, 100))], { type });
  return new File([blob], name, { type });
};

export const WithFiles: Story = {
  render: function WithFilesStory() {
    const mockFiles: FileUploadFile[] = [
      {
        id: "1",
        file: createMockFile("report-q4-2025.pdf", 2_450_000, "application/pdf"),
        progress: 0,
        status: "idle",
      },
      {
        id: "2",
        file: createMockFile("dashboard-screenshot.png", 890_000, "image/png"),
        progress: 65,
        status: "uploading",
      },
      {
        id: "3",
        file: createMockFile("data-export.csv", 340_000, "text/csv"),
        progress: 100,
        status: "success",
      },
      {
        id: "4",
        file: createMockFile("corrupted-file.zip", 5_200_000, "application/zip"),
        progress: 30,
        status: "error",
        error: "Upload failed: network timeout",
      },
    ];

    const [files, setFiles] = React.useState<FileUploadFile[]>(mockFiles);

    const handleRemove = (fileId: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    return (
      <div className="p-6 max-w-lg">
        <FileUpload
          value={files}
          onRemove={handleRemove}
          description="Shows files in various upload states"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    description: "Upload is currently disabled",
  },
  render: function DisabledStory(args) {
    return (
      <div className="p-6 max-w-lg">
        <FileUpload {...args} />
      </div>
    );
  },
};

export const InsideField: Story = {
  render: () => (
    <div className="p-6 max-w-lg">
      <Field label="Attachments" description="Upload supporting documents" required>
        <FileUpload description="PNG, JPG, PDF up to 10MB" />
      </Field>
    </div>
  ),
};

export const InsideFieldWithError: Story = {
  render: () => (
    <div className="p-6 max-w-lg">
      <Field label="Attachments" error errorMessage="This field is required.">
        <FileUpload description="PNG, JPG, PDF up to 10MB" />
      </Field>
    </div>
  ),
};
