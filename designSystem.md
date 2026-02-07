# Kaspa Live Auction Engine — Design System

## 1. Overview

The Design System ensures visual consistency, accessibility, and clarity across the Kaspa Live Auction Engine. It supports the Payments & Commerce track by delivering a professional, intuitive, and polished UX.

---

## 2. Color Palette

| Role           | Color                  | Usage                                |
| -------------- | ---------------------- | ------------------------------------ |
| Primary        | #4F46E5 (Indigo)       | Buttons, links, primary actions      |
| Secondary      | #6366F1 (Light Indigo) | Secondary buttons, hover states      |
| Success        | #10B981 (Green)        | Bid accepted, payment confirmed      |
| Warning        | #F59E0B (Amber)        | Pending transactions, attention cues |
| Error          | #EF4444 (Red)          | Invalid bids, failed transactions    |
| Background     | #F9FAFB (Light Gray)   | Page background                      |
| Text Primary   | #111827 (Dark Gray)    | Headlines, primary text              |
| Text Secondary | #6B7280 (Gray)         | Secondary text, labels               |

---

## 3. Typography

| Element       | Font  | Weight | Size |
| ------------- | ----- | ------ | ---- |
| Heading 1     | Inter | 700    | 36px |
| Heading 2     | Inter | 600    | 28px |
| Heading 3     | Inter | 500    | 22px |
| Body          | Inter | 400    | 16px |
| Small / Label | Inter | 400    | 14px |

Line height: 1.5x font size for readability.

---

## 4. Spacing & Layout

* Base unit: 8px
* Margins / padding: multiples of 8px
* Grid system: 12-column, responsive
* Card & container spacing: 16px / 24px
* Auction item spacing: 12px vertical

---

## 5. UI Components

### Buttons

* Primary: filled indigo (#4F46E5), white text
* Secondary: outline, indigo border, text #4F46E5
* Disabled: gray #D1D5DB
* Hover: darken 10%

### Bid Status Badge

* Pending: amber (#F59E0B) blinking animation 0.5s pulse
* Detected: light green (#6EE7B7) fade-in 0.3s
* Confirmed: green (#10B981) with check icon

### Cards / Auction Items

* White background (#FFFFFF), soft shadow (0px 4px 6px rgba(0,0,0,0.1))
* Rounded corners 12px
* Highlight active auction with border #4F46E5

### Inputs / Forms

* Rounded corners 8px
* Border #D1D5DB
* Focus: border #4F46E5, shadow subtle 0.2s
* Error: border #EF4444

---

## 6. Animations & Transitions

* Bid updates: fade in 0.3s
* Button hover: scale 1.05 over 0.2s
* Badge pulse for pending bids: 0.5s loop
* Auction end countdown: subtle color flash in last 5s

---

## 7. Accessibility

* Text contrast WCAG AA compliant
* Focus states visible (outline 2px #4F46E5)
* Animations can be disabled for motion sensitivity
* Keyboard navigable buttons, inputs, and forms
* Aria labels for live auction feed, bid buttons, and status badges

---

## 8. UX Principles

* Clear feedback for user actions (bid submitted → detected → confirmed)
* Minimal cognitive load: all key info above the fold
* Consistent spacing and typography across screens
* Responsive design for mobile, tablet, desktop
* Show timestamps for transparency and Kaspa speed demonstration

---

## 9. Recommended Usage

* Reuse components wherever possible (Button, Badge, Card)
* Follow spacing and typography for consistency
* Highlight Kaspa’s speed visually (timestamps, animations)
* Ensure auction critical info is immediately visible

This design system ensures a polished, professional, and hackathon-competitive UX.
