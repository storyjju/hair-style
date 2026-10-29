import { expect, test } from "@playwright/test";

test("전체 스타일에서 360도 보기와 미용실 추천까지 이어진다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("헤어스타일 추천");
  await page.getByRole("button", { name: "사진 없이 전체 스타일 보기" }).click();
  await page.getByRole("button", { name: /댄디컷/ }).click();

  const viewer = page.getByTestId("viewer-360");
  await expect(viewer).toHaveAttribute("data-angle", "front");
  await viewer.focus();
  await page.keyboard.press("ArrowRight");
  await expect(viewer).toHaveAttribute("data-angle", "right");

  await expect(
    page.getByRole("region", { name: "이 스타일을 해주는 미용실" })
  ).toBeVisible();
});

test("동의하지 않으면 사진을 선택할 수 없다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByLabel("내 사진")).toBeDisabled();
  await page.getByLabel("사진을 외부 AI 서비스로 전송하는 것에 동의합니다.").check();
  await expect(page.getByLabel("내 사진")).toBeEnabled();
});
