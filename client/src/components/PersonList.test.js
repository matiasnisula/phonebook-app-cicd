/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PersonsList from "./PersonsList";

const personList = [
  {
    id: "1",
    name: "ossi",
    number: "111-111111",
  },
  {
    id: "2",
    name: "ville",
    number: "222-22222",
  },
];

describe("<PersonList />", () => {
  it("should render persons", () => {
    const handleDelete = jest.fn();
    render(<PersonsList persons={personList} handleDelete={handleDelete} />);
    expect(screen.getByText("ossi", { exact: false })).toBeDefined();
    expect(screen.getByText("ville", { exact: false })).toBeDefined();
    expect(screen.getByText("111-111111", { exact: false })).toBeDefined();
    expect(screen.getByText("222-22222", { exact: false })).toBeDefined();
  });
});
