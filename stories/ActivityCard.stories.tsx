import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ActivityCard } from '../components/activity-card';

const meta = {
  title: 'Components/ActivityCard',
  component: ActivityCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ActivityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {
  args: {
    name: 'Interactive Quiz',
    isStreaming: false,
    onClick: fn(),
  },
};

export const Streaming: Story = {
  args: {
    name: 'Interactive Quiz',
    isStreaming: true,
    onClick: fn(),
  },
};

export const CompleteLongName: Story = {
  args: {
    name: 'Advanced Math Problem Solver with Interactive Visualization',
    isStreaming: false,
    onClick: fn(),
  },
};

export const StreamingLongName: Story = {
  args: {
    name: 'Advanced Math Problem Solver with Interactive Visualization',
    isStreaming: true,
    onClick: fn(),
  },
};
