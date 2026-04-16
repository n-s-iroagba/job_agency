# Design System Specification: The Architectural Professional

## 1. Overview & Creative North Star
**Creative North Star: The Precision Curator**

This design system is built to move the job agency experience away from the cluttered "bulletin board" aesthetic and toward a high-end, editorial platform. We are not just listing jobs; we are curating careers. The visual language centers on **The Precision Curator**—a philosophy that favors intentional white space, high-contrast typographic scales, and layered depth over traditional grid lines.

By utilizing a "Smooth Tech" approach, we break the template look through **intentional asymmetry**. For example, large `display-lg` headlines should sit offset against high-quality imagery, and containers should feel like they are floating in an expansive, airy environment. We prioritize the "breathability" of the interface to convey efficiency and sophistication.

---

## 2. Colors & Surface Philosophy

The palette is anchored in a refined Royal Blue, supported by a sophisticated range of blues and cool greys. 

### The "No-Line" Rule
**Borders are forbidden for sectioning.** To achieve a high-end feel, boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit directly on a `surface` background to denote a change in context. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following tiers to define importance without adding visual noise:
- **Base Layer:** `surface` (#f7f9fb) for the main application background.
- **Sectioning:** `surface-container-low` (#f2f4f6) for large content areas.
- **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide the highest contrast and "pop" against the background.

### The "Glass & Gradient" Rule
To inject "soul" into the tech-heavy interface:
- **Main CTAs/Hero Backgrounds:** Use a subtle linear gradient from `primary` (#004ac6) to `primary_container` (#2563eb).
- **Floating Elements:** Use Glassmorphism. Apply `surface_container_lowest` at 70% opacity with a `24px` backdrop blur to create a frosted glass effect for navigation bars or floating action panels.

---

## 3. Typography: Editorial Authority

We use **Inter** exclusively. The power of this system lies in the dramatic contrast between oversized display type and tight, functional labels.

| Token | Size | Weight | Use Case |
| :--- | :--- | :--- | :--- |
| `display-lg` | 3.5rem | 700 | Hero statements and high-impact stats. |
| `headline-md` | 1.75rem | 600 | Page titles and major section headers. |
| `title-sm` | 1rem | 600 | Card titles and sub-navigation. |
| `body-md` | 0.875rem | 400 | General reading and candidate descriptions. |
| `label-md` | 0.75rem | 500 (Caps) | Metadata, tags, and small utility text. |

**Hierarchy Note:** Always pair a `display-lg` headline with a `body-lg` lead-in paragraph. Use `on_surface_variant` (#434655) for secondary text to maintain a sophisticated, lower-contrast look that reduces eye fatigue.

---

## 4. Elevation & Depth

We eschew traditional structural lines in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background provides a soft, natural lift.
*   **Ambient Shadows:** For floating elements (like modals), use extra-diffused shadows: `box-shadow: 0 20px 40px rgba(25, 28, 30, 0.06)`. The shadow must be a tinted version of the `on-surface` color, never pure black.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility (e.g., input fields), use the `outline_variant` (#c3c6d7) at **20% opacity**. 100% opaque borders are strictly prohibited.
*   **Glassmorphism:** Use for persistent elements like the Header. It integrates the UI by allowing colors to bleed through, making the layout feel like a single cohesive ecosystem.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` gradient. `0.5rem` (8px) radius. Use `on_primary` text.
*   **Secondary:** `surface-container-high` background with `on_secondary_container` text. No border.
*   **Tertiary:** Ghost style. No background, `primary` text. 

### Cards & Lists
*   **Rule:** Forbid divider lines. Separate list items using `16px` of vertical white space or a subtle hover state shift to `surface-container-highest`.
*   **Job Cards:** Use `surface-container-lowest` with an 8px radius. Include a subtle `4%` ambient shadow on hover to signal interactivity.

### Input Fields
*   **Style:** Minimalist. Background `surface-container-low`, no border, `8px` radius. On focus, transition background to `surface-container-lowest` and add a `1px` "Ghost Border" using the `primary` color at 40% opacity.

### Signature Component: The Candidate Spotlight
A bespoke component for this platform. A large, asymmetric card using a `32px` padding, a high-quality headshot with a soft mask, and `display-sm` typography for the candidate's "USP" (Unique Selling Point).

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts (e.g., left-aligned text with an offset right-aligned image).
*   **Do** use `surface` shifts to define content blocks instead of lines.
*   **Do** apply `8px` (0.5rem) rounding to all interactive containers.
*   **Do** use `tertiary` (#943700) sparingly for high-value alerts or "Exclusive" job tags.

### Don't
*   **Don't** use 1px solid, high-contrast borders. They break the "smooth tech" flow.
*   **Don't** use standard drop shadows. Always use the high-blur, low-opacity ambient shadow spec.
*   **Don't** crowd the interface. If a screen feels full, increase the white space by 20%.
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1e).

---

## 7. Interaction & Motion
Transitions should be "weighty" and smooth. 
*   **Surface Transitions:** When a card expands, use a `300ms` cubic-bezier(0.4, 0, 0.2, 1) curve.
*   **Hover States:** Background color shifts should be subtle (e.g., from `surface-container-low` to `surface-container-high`).