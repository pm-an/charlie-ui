import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileUpload, type FileUploadFile } from "../FileUpload";
import { Field } from "../Field";

function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  const content = new Array(size).fill("a").join("");
  return new File([content], name, { type });
}

function createDataTransfer(files: File[]): DataTransfer {
  return {
    files: files as unknown as FileList,
    items: files.map((file) => ({
      kind: "file",
      type: file.type,
      getAsFile: () => file,
    })) as unknown as DataTransferItemList,
    types: ["Files"],
    dropEffect: "none",
    effectAllowed: "all",
    clearData: vi.fn(),
    getData: vi.fn(),
    setData: vi.fn(),
    setDragImage: vi.fn(),
  } as unknown as DataTransfer;
}

describe("FileUpload", () => {
  describe("rendering", () => {
    it("renders dropzone variant by default", () => {
      render(<FileUpload />);
      expect(screen.getByTestId("dropzone")).toBeInTheDocument();
      expect(
        screen.getByText("Drop files here or click to browse")
      ).toBeInTheDocument();
    });

    it("renders button variant", () => {
      render(<FileUpload variant="button" />);
      expect(
        screen.getByRole("button", { name: "Upload files" })
      ).toBeInTheDocument();
      expect(screen.queryByTestId("dropzone")).not.toBeInTheDocument();
    });

    it("renders custom label", () => {
      render(<FileUpload label="Choose documents" />);
      expect(screen.getByText("Choose documents")).toBeInTheDocument();
    });

    it("renders description", () => {
      render(<FileUpload description="PNG, JPG up to 10MB" />);
      expect(screen.getByText("PNG, JPG up to 10MB")).toBeInTheDocument();
    });

    it("renders custom icon", () => {
      render(
        <FileUpload icon={<span data-testid="custom-icon">icon</span>} />
      );
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("opens file dialog on click", () => {
      render(<FileUpload />);
      const input = screen.getByTestId("file-input") as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.click(screen.getByTestId("dropzone"));
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it("opens file dialog on button variant click", () => {
      render(<FileUpload variant="button" />);
      const input = screen.getByTestId("file-input") as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.click(
        screen.getByRole("button", { name: "Upload files" })
      );
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it("handles file selection via input change", () => {
      const onChange = vi.fn();
      render(<FileUpload onChange={onChange} />);
      const input = screen.getByTestId("file-input");
      const file = createMockFile("test.png", 100, "image/png");

      fireEvent.change(input, { target: { files: [file] } });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith([file]);
    });

    it("handles drag and drop", () => {
      const onChange = vi.fn();
      render(<FileUpload onChange={onChange} />);
      const dropzone = screen.getByTestId("dropzone");
      const file = createMockFile("test.pdf", 200, "application/pdf");
      const dataTransfer = createDataTransfer([file]);

      fireEvent.drop(dropzone, { dataTransfer });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith([file]);
    });

    it("shows drag-over state", () => {
      render(<FileUpload />);
      const dropzone = screen.getByTestId("dropzone");

      fireEvent.dragEnter(dropzone, {
        dataTransfer: createDataTransfer([]),
      });
      expect(dropzone).toHaveClass("border-accent/50");
      expect(dropzone).toHaveClass("bg-accent/5");

      fireEvent.dragLeave(dropzone, {
        dataTransfer: createDataTransfer([]),
      });
      expect(dropzone).not.toHaveClass("border-accent/50");
    });

    it("does not open file dialog when disabled", () => {
      render(<FileUpload disabled />);
      const input = screen.getByTestId("file-input") as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.click(screen.getByTestId("dropzone"));
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it("does not process dropped files when disabled", () => {
      const onChange = vi.fn();
      render(<FileUpload disabled onChange={onChange} />);
      const dropzone = screen.getByTestId("dropzone");
      const file = createMockFile("test.pdf", 200, "application/pdf");

      fireEvent.drop(dropzone, {
        dataTransfer: createDataTransfer([file]),
      });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    it("validates file type against accept prop", () => {
      const onChange = vi.fn();
      render(<FileUpload accept="image/*" onChange={onChange} />);
      const input = screen.getByTestId("file-input");
      const pdfFile = createMockFile("doc.pdf", 100, "application/pdf");
      const imgFile = createMockFile("photo.png", 100, "image/png");

      fireEvent.change(input, { target: { files: [pdfFile, imgFile] } });
      expect(onChange).toHaveBeenCalledWith([imgFile]);
    });

    it("validates file type with extension accept", () => {
      const onChange = vi.fn();
      render(<FileUpload accept=".pdf,.doc" onChange={onChange} />);
      const input = screen.getByTestId("file-input");
      const pdfFile = createMockFile("report.pdf", 100, "application/pdf");
      const txtFile = createMockFile("notes.txt", 100, "text/plain");

      fireEvent.change(input, { target: { files: [pdfFile, txtFile] } });
      expect(onChange).toHaveBeenCalledWith([pdfFile]);
    });

    it("validates file size against maxSize", () => {
      const onChange = vi.fn();
      render(<FileUpload maxSize={500} onChange={onChange} />);
      const input = screen.getByTestId("file-input");
      const smallFile = createMockFile("small.txt", 100, "text/plain");
      const bigFile = createMockFile("big.txt", 1000, "text/plain");

      fireEvent.change(input, {
        target: { files: [smallFile, bigFile] },
      });
      expect(onChange).toHaveBeenCalledWith([smallFile]);
    });

    it("validates max files count", () => {
      const onChange = vi.fn();
      const existingFiles: FileUploadFile[] = [
        {
          id: "1",
          file: createMockFile("existing.txt", 50, "text/plain"),
          progress: 100,
          status: "success",
        },
      ];
      render(
        <FileUpload maxFiles={2} value={existingFiles} onChange={onChange} />
      );
      const input = screen.getByTestId("file-input");
      const file1 = createMockFile("new1.txt", 50, "text/plain");
      const file2 = createMockFile("new2.txt", 50, "text/plain");

      fireEvent.change(input, { target: { files: [file1, file2] } });
      // Only 1 slot remaining (maxFiles=2, 1 existing)
      expect(onChange).toHaveBeenCalledWith([file1]);
    });

    it("does not call onChange when all files are rejected", () => {
      const onChange = vi.fn();
      render(<FileUpload accept="image/*" onChange={onChange} />);
      const input = screen.getByTestId("file-input");
      const pdfFile = createMockFile("doc.pdf", 100, "application/pdf");

      fireEvent.change(input, { target: { files: [pdfFile] } });
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("file list", () => {
    const mockFiles: FileUploadFile[] = [
      {
        id: "idle-1",
        file: createMockFile("document.pdf", 2000, "application/pdf"),
        progress: 0,
        status: "idle",
      },
      {
        id: "uploading-1",
        file: createMockFile("photo.png", 5000, "image/png"),
        progress: 45,
        status: "uploading",
      },
      {
        id: "success-1",
        file: createMockFile("data.csv", 300, "text/csv"),
        progress: 100,
        status: "success",
      },
      {
        id: "error-1",
        file: createMockFile("broken.zip", 8000, "application/zip"),
        progress: 30,
        status: "error",
        error: "Network timeout",
      },
    ];

    it("shows file list when showFileList is true and files exist", () => {
      render(<FileUpload value={mockFiles} />);
      expect(screen.getByTestId("file-list")).toBeInTheDocument();
      expect(screen.getByText("document.pdf")).toBeInTheDocument();
      expect(screen.getByText("photo.png")).toBeInTheDocument();
      expect(screen.getByText("data.csv")).toBeInTheDocument();
      expect(screen.getByText("broken.zip")).toBeInTheDocument();
    });

    it("hides file list when showFileList is false", () => {
      render(<FileUpload value={mockFiles} showFileList={false} />);
      expect(screen.queryByTestId("file-list")).not.toBeInTheDocument();
    });

    it("does not show file list when value is empty", () => {
      render(<FileUpload value={[]} />);
      expect(screen.queryByTestId("file-list")).not.toBeInTheDocument();
    });

    it("shows upload progress bar for uploading files", () => {
      render(
        <FileUpload
          value={[
            {
              id: "up-1",
              file: createMockFile("upload.txt", 100, "text/plain"),
              progress: 60,
              status: "uploading",
            },
          ]}
        />
      );
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute("aria-valuenow", "60");
    });

    it("shows success icon for completed files", () => {
      render(
        <FileUpload
          value={[
            {
              id: "done-1",
              file: createMockFile("done.txt", 100, "text/plain"),
              progress: 100,
              status: "success",
            },
          ]}
        />
      );
      expect(screen.getByTestId("success-icon")).toBeInTheDocument();
    });

    it("shows error icon and message for failed files", () => {
      render(
        <FileUpload
          value={[
            {
              id: "err-1",
              file: createMockFile("fail.txt", 100, "text/plain"),
              progress: 30,
              status: "error",
              error: "Upload failed",
            },
          ]}
        />
      );
      expect(screen.getByTestId("error-icon")).toBeInTheDocument();
      expect(screen.getByText("Upload failed")).toBeInTheDocument();
    });

    it("calls onRemove with file id when remove button is clicked", () => {
      const onRemove = vi.fn();
      render(
        <FileUpload
          value={[
            {
              id: "rm-1",
              file: createMockFile("remove-me.txt", 100, "text/plain"),
              progress: 0,
              status: "idle",
            },
          ]}
          onRemove={onRemove}
        />
      );
      fireEvent.click(screen.getByLabelText("Remove remove-me.txt"));
      expect(onRemove).toHaveBeenCalledWith("rm-1");
    });

    it("does not show remove buttons when onRemove is not provided", () => {
      render(
        <FileUpload
          value={[
            {
              id: "no-rm",
              file: createMockFile("keep.txt", 100, "text/plain"),
              progress: 0,
              status: "idle",
            },
          ]}
        />
      );
      expect(
        screen.queryByLabelText("Remove keep.txt")
      ).not.toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("applies disabled styling to dropzone", () => {
      render(<FileUpload disabled />);
      const dropzone = screen.getByTestId("dropzone");
      expect(dropzone).toHaveClass("opacity-70");
      expect(dropzone).toHaveClass("cursor-not-allowed");
    });

    it("applies disabled styling to button variant", () => {
      render(<FileUpload variant="button" disabled />);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("opacity-70");
    });

    it("disables the hidden file input", () => {
      render(<FileUpload disabled />);
      const input = screen.getByTestId("file-input");
      expect(input).toBeDisabled();
    });
  });

  describe("sizes", () => {
    it("renders each size without errors", () => {
      const sizes = ["sm", "md", "lg"] as const;
      sizes.forEach((size) => {
        const { unmount } = render(<FileUpload size={size} />);
        expect(screen.getByTestId("dropzone")).toBeInTheDocument();
        unmount();
      });
    });

    it("applies sm size class", () => {
      render(<FileUpload size="sm" />);
      expect(screen.getByTestId("dropzone")).toHaveClass("py-6");
    });

    it("applies md size class", () => {
      render(<FileUpload size="md" />);
      expect(screen.getByTestId("dropzone")).toHaveClass("py-10");
    });

    it("applies lg size class", () => {
      render(<FileUpload size="lg" />);
      expect(screen.getByTestId("dropzone")).toHaveClass("py-16");
    });
  });

  describe("className merging", () => {
    it("applies custom className to wrapper", () => {
      const { container } = render(<FileUpload className="my-custom" />);
      expect(container.firstChild).toHaveClass("my-custom");
      expect(container.firstChild).toHaveClass("w-full");
    });

    it("spreads additional HTML attributes", () => {
      render(<FileUpload data-testid="custom-upload" />);
      expect(screen.getByTestId("custom-upload")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("dropzone has button role", () => {
      render(<FileUpload />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("dropzone is keyboard accessible", () => {
      render(<FileUpload />);
      const dropzone = screen.getByTestId("dropzone");
      const input = screen.getByTestId("file-input") as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");

      fireEvent.keyDown(dropzone, { key: "Enter" });
      expect(clickSpy).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(dropzone, { key: " " });
      expect(clickSpy).toHaveBeenCalledTimes(2);
    });

    it("dropzone has tabIndex 0 when not disabled", () => {
      render(<FileUpload />);
      expect(screen.getByTestId("dropzone")).toHaveAttribute("tabindex", "0");
    });

    it("dropzone has tabIndex -1 when disabled", () => {
      render(<FileUpload disabled />);
      expect(screen.getByTestId("dropzone")).toHaveAttribute("tabindex", "-1");
    });

    it("progress bar has proper ARIA attributes", () => {
      render(
        <FileUpload
          value={[
            {
              id: "a11y-1",
              file: createMockFile("file.txt", 100, "text/plain"),
              progress: 75,
              status: "uploading",
            },
          ]}
        />
      );
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "75");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    });

    it("remove buttons have accessible labels", () => {
      const onRemove = vi.fn();
      render(
        <FileUpload
          value={[
            {
              id: "a11y-rm",
              file: createMockFile("my-file.txt", 100, "text/plain"),
              progress: 0,
              status: "idle",
            },
          ]}
          onRemove={onRemove}
        />
      );
      expect(
        screen.getByLabelText("Remove my-file.txt")
      ).toBeInTheDocument();
    });
  });

  describe("FileUpload inside Field", () => {
    it("suppresses own label and error when inside Field", () => {
      render(
        <Field label="Field Label" error errorMessage="Field error">
          <FileUpload
            label="Own Label"
            description="Own description"
            error
            errorMessage="Own error"
          />
        </Field>
      );
      expect(screen.getByText("Field Label")).toBeInTheDocument();
      expect(screen.queryByText("Own Label")).not.toBeInTheDocument();
      expect(screen.queryByText("Own description")).not.toBeInTheDocument();
      expect(screen.getByText("Field error")).toBeInTheDocument();
      expect(screen.queryByText("Own error")).not.toBeInTheDocument();
    });

    it("renders normally when standalone", () => {
      render(
        <FileUpload
          label="Standalone Label"
          description="Standalone description"
          error
          errorMessage="Standalone error"
        />
      );
      expect(screen.getByText("Standalone Label")).toBeInTheDocument();
      expect(screen.getByText("Standalone description")).toBeInTheDocument();
      expect(screen.getByText("Standalone error")).toBeInTheDocument();
    });
  });
});
