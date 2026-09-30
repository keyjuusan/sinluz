import type { ComponentProps } from "react";

export default function Button({
  children,
  ...restProps
}: ComponentProps<"button">) {
  return <button {...restProps}>{children}</button>;
}
