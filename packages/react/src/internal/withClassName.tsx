import { forwardRef, type ComponentType } from 'react';

type ClassName = string | ((state: unknown) => string | undefined) | undefined;

const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ');

/**
 * Give a Base UI part this system's class, and change nothing else about it.
 *
 * The returned component has the type of the one passed in: same props, same ref, same state
 * callbacks. The consumer's own `className` (a string, or Base UI's function of state) is kept and
 * placed after ours, so the prop surface a module exports is still Base UI's (ADR 0003).
 */
// A part's props are whatever Base UI declares; this helper is generic over all of them.
export function withClassName<C extends ComponentType<any>>(
  Component: C,
  base: string | undefined,
): C {
  const Part = Component as ComponentType<any>;
  const Styled = forwardRef<unknown, { className?: ClassName }>(function Styled(
    { className, ...rest },
    ref,
  ) {
    const merged =
      typeof className === 'function'
        ? (state: unknown) => join(base, className(state))
        : join(base, className);
    return <Part ref={ref} {...rest} className={merged} />;
  });
  Styled.displayName = Part.displayName ?? Part.name;
  return Styled as unknown as C;
}
