import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

import Home from "@/app/page";
import { HAIR_STYLES } from "@/lib/hairstyle/catalog";

test("동의 전에는 사진 선택과 분석 버튼이 막혀 있다", async () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "헤어스타일 추천" })
  ).toBeInTheDocument();
  expect(screen.getByLabelText("내 사진")).toBeDisabled();
  expect(
    screen.getByRole("button", { name: "사진으로 추천받기" })
  ).toBeDisabled();
});

test("사진 없이도 전체 스타일을 보고 360도 보기와 미용실까지 이어진다", async () => {
  const user = userEvent.setup();
  render(<Home />);

  await user.click(
    screen.getByRole("button", { name: "사진 없이 전체 스타일 보기" })
  );
  expect(screen.getAllByRole("listitem")).toHaveLength(HAIR_STYLES.length);

  await user.click(screen.getByRole("button", { name: /댄디컷/ }));
  const viewer = screen.getByTestId("viewer-360");
  expect(viewer).toHaveAttribute("data-angle", "front");

  viewer.focus();
  await user.keyboard("{ArrowRight}");
  expect(viewer).toHaveAttribute("data-angle", "right");
  await user.keyboard("{ArrowLeft}{ArrowLeft}");
  expect(viewer).toHaveAttribute("data-angle", "left");

  expect(
    screen.getByRole("region", { name: "이 스타일을 해주는 미용실" })
  ).toBeInTheDocument();
  expect(screen.getByText("내 위치를 사용하면 근처 미용실을 먼저 보여드립니다.")).toBeInTheDocument();
});
