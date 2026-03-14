import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    totalPages: 10,
    siblingCount: 1,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(1);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Pagination")).toBeVisible();
    await expect(canvas.getByLabelText("Go to page 1")).toBeVisible();
    // Click page 5
    await userEvent.click(canvas.getByLabelText("Go to page 3"));
    await expect(canvas.getByLabelText("Go to page 3")).toHaveAttribute(
      "aria-current",
      "page"
    );
  },
};

export const ManyPages: Story = {
  args: {
    totalPages: 50,
    siblingCount: 1,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(25);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Current page (25) should have aria-current
    await expect(canvas.getByLabelText("Go to page 25")).toHaveAttribute(
      "aria-current",
      "page"
    );
    // First and last visible
    await expect(canvas.getByLabelText("Go to page 1")).toBeVisible();
    await expect(canvas.getByLabelText("Go to page 50")).toBeVisible();
  },
};

export const FewPages: Story = {
  args: {
    totalPages: 5,
    siblingCount: 1,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(3);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // All pages should be shown (no ellipsis needed)
    for (let i = 1; i <= 5; i++) {
      await expect(canvas.getByLabelText(`Go to page ${i}`)).toBeVisible();
    }
  },
};

export const SmallSize: Story = {
  args: {
    totalPages: 10,
    size: "sm",
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(1);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const LargeSize: Story = {
  args: {
    totalPages: 10,
    size: "lg",
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(1);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const WithoutFirstLast: Story = {
  args: {
    totalPages: 20,
    showFirstLast: false,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(10);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByLabelText("Go to first page")).toBeNull();
    expect(canvas.queryByLabelText("Go to last page")).toBeNull();
    await expect(canvas.getByLabelText("Go to previous page")).toBeVisible();
    await expect(canvas.getByLabelText("Go to next page")).toBeVisible();
  },
};

export const WithoutPrevNext: Story = {
  args: {
    totalPages: 20,
    showPrevNext: false,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(10);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByLabelText("Go to previous page")).toBeNull();
    expect(canvas.queryByLabelText("Go to next page")).toBeNull();
    await expect(canvas.getByLabelText("Go to first page")).toBeVisible();
    await expect(canvas.getByLabelText("Go to last page")).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    totalPages: 10,
    disabled: true,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(5);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");
    for (const button of buttons) {
      expect(button).toBeDisabled();
    }
  },
};

export const FirstPage: Story = {
  args: {
    totalPages: 10,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(1);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // First/prev should be disabled at page 1
    await expect(canvas.getByLabelText("Go to first page")).toBeDisabled();
    await expect(canvas.getByLabelText("Go to previous page")).toBeDisabled();
    // Next/last should be enabled
    await expect(canvas.getByLabelText("Go to next page")).toBeEnabled();
    await expect(canvas.getByLabelText("Go to last page")).toBeEnabled();
  },
};

export const LastPage: Story = {
  args: {
    totalPages: 10,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = React.useState(10);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Next/last should be disabled at last page
    await expect(canvas.getByLabelText("Go to next page")).toBeDisabled();
    await expect(canvas.getByLabelText("Go to last page")).toBeDisabled();
    // First/prev should be enabled
    await expect(canvas.getByLabelText("Go to first page")).toBeEnabled();
    await expect(canvas.getByLabelText("Go to previous page")).toBeEnabled();
  },
};
