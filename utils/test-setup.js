import { vi } from "vitest";

vi.mock('@mui/styles/makeStyles', () => ({
  default: vi.fn(() => vi.fn(() => ({})))
}));
