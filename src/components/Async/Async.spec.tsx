import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Async } from ".";

test("it renderes correctly", async () => {
  render(<Async />);

  expect(screen.getByText("Hello World")).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByText("Button 2"), {timeout: 3000});
  await waitFor(
    () => {
      return expect(screen.getByText("Button")).toBeInTheDocument();
    },
    {
      timeout: 3000,
    }
  );
});
