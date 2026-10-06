import type { ButtonHTMLAttributes, ReactNode } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Label for the custom cursor. */
  cursor?: string;
};

type LinkButtonProps = Common & {
  href: string;
  /** External or mailto links skip the page transition. */
  external?: boolean;
};

type NativeButtonProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const base =
  "inline-flex items-center justify-center rounded-pill text-center leading-none whitespace-nowrap select-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Badge red carries the primary action only. Midnight text: 4.89:1.
  primary: "bg-badge text-midnight",
  secondary: "border-2 border-current text-ink hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "text-body min-h-14 px-7",
  lg: "text-h3 min-h-20 px-10 lg:min-h-26 lg:px-14",
};

/** Pill button. Renders a link when given `href`, otherwise a native button. */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, cursor } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { href, external } = props;
    if (external || /^(https?:|mailto:|tel:)/.test(href)) {
      return (
        <a href={href} className={classes} data-cursor={cursor}>
          {children}
        </a>
      );
    }
    return (
      <TransitionLink href={href} className={classes} data-cursor={cursor}>
        {children}
      </TransitionLink>
    );
  }

  const {
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    cursor: _cursor,
    href: _href,
    type = "button",
    ...rest
  } = props;
  return (
    <button type={type} className={classes} data-cursor={cursor} {...rest}>
      {children}
    </button>
  );
}
