# Talent Hub UI Pipes Documentation

> **Last Updated:** January 27, 2026  
> **Version:** 1.0.0  
> **Test Coverage:** 100%

This document provides a comprehensive guide to all custom pipes available in the `talent-hub-ui` library.

## Table of Contents

1. [Date & Time Pipes](#date--time-pipes)
2. [Text Formatting Pipes](#text-formatting-pipes)
3. [Number Formatting Pipes](#number-formatting-pipes)
4. [Security Pipes](#security-pipes)
5. [File Utility Pipes](#file-utility-pipes)

## Quick Reference

| Pipe           | Category     | Description                                 |
| -------------- | ------------ | ------------------------------------------- |
| `timeAgo`      | Date & Time  | Display relative time (e.g., "2 hours ago") |
| `duration`     | Date & Time  | Format time durations (e.g., "2h 30m")      |
| `businessDays` | Date & Time  | Calculate business days between dates       |
| `truncate`     | Text         | Truncate long text with ellipsis            |
| `initials`     | Text         | Extract initials from names (e.g., "JD")    |
| `percentage`   | Number       | Format numbers as percentages               |
| `sanitize`     | Security     | Sanitize HTML content for safe display      |
| `fileSize`     | File Utility | Format file sizes (e.g., "2.5 MB")          |

---

## Date & Time Pipes

### timeAgo

Displays relative time from a given date (e.g., "2 hours ago", "3 days ago", "just now").

**Usage:**

```html
<!-- Last activity -->
<div>Last active: {{ candidate.lastActivityDate | timeAgo }}</div>

<!-- Application submission time -->
<div>Applied {{ application.submittedAt | timeAgo }}</div>

<!-- Interview scheduled time -->
<div>Interview {{ interview.scheduledAt | timeAgo }}</div>
```

**Features:**

- Automatically handles seconds, minutes, hours, days, months, and years
- Returns "just now" for very recent times (< 30 seconds)
- Handles both past and future dates (e.g., "in 2 hours")
- Type-safe with strict typing

**Examples:**

- 10 seconds ago → "just now"
- 45 seconds ago → "45 seconds ago"
- 5 minutes ago → "5 minutes ago"
- 2 hours ago → "2 hours ago"
- 3 days ago → "3 days ago"
- Future date (2 hours) → "in 2 hours"

---

### duration

Formats time durations in human-readable format (e.g., "2h 30m", "45 minutes").

**Usage:**

```html
<!-- Default format (short) -->
<div>Duration: {{ interview.duration | duration }}</div>

<!-- Long format -->
<div>Time spent: {{ assessment.timeSpent | duration:'long' }}</div>

<!-- Compact format -->
<div>Time to hire: {{ timeToHire | duration:'compact' }}</div>

<!-- Duration in seconds -->
<div>{{ durationInSeconds | duration:'short':'seconds' }}</div>
```

**Inputs:**

- `value` (number): Duration in milliseconds (default) or seconds
- `format` ('short' | 'long' | 'compact'): Output format (default: 'short')
- `unit` ('milliseconds' | 'seconds'): Input unit (default: 'milliseconds')

**Format Examples:**

- **short**: "2h 30m", "45m", "30s"
- **long**: "2 hours 30 minutes", "45 minutes", "30 seconds"
- **compact**: "2.5h", "45.0m", "30s"

**Features:**

- Supports multiple format styles
- Handles input in milliseconds or seconds
- Intelligent unit selection based on duration
- Type-safe with strict typing

---

### businessDays

Calculates business days (Monday-Friday) between two dates, excluding weekends.

**Usage:**

```html
<!-- Days since requisition created (to now) -->
<div>Open for: {{ requisition.createdAt | businessDays }} business days</div>

<!-- Days between two dates -->
<div>Time to fill: {{ req.createdAt | businessDays:req.filledAt }} business days</div>

<!-- With formatted output -->
<div>{{ candidate.stageEnteredAt | businessDays:null:true }}</div>
<!-- Output: "5 business days" -->
```

**Inputs:**

- `startDate` (Date | string | number): The start date
- `endDate` (Date | string | number | null): The end date (defaults to current date if null)
- `includeLabel` (boolean): Whether to include "business day(s)" label in output (default: false)

**Features:**

- Automatically excludes weekends (Saturday and Sunday)
- Can calculate from a date to now or between two dates
- Supports formatted output with labels
- Handles various date formats (Date objects, timestamps, ISO strings)

**Use Cases:**

- Requisition aging
- Days in pipeline stage
- SLA calculations

---

## Text Formatting Pipes

### truncate

Truncates long text with ellipsis for display in limited space.

**Usage:**

```html
<!-- Default truncation (100 characters) -->
<p>{{ candidate.summary | truncate }}</p>

<!-- Custom length (50 characters) -->
<p>{{ jobDescription | truncate:50 }}</p>

<!-- Custom ellipsis -->
<p>{{ notes | truncate:80:' [...]' }}</p>

<!-- Break at word boundaries -->
<p>{{ text | truncate:80:'...':true }}</p>
```

**Inputs:**

- `value` (string): The text to truncate
- `limit` (number): Maximum length before truncation (default: 100)
- `ellipsis` (string): The suffix to add when truncated (default: '...')
- `wordBreak` (boolean): Whether to break at word boundaries (default: false)

**Features:**

- Configurable maximum length
- Custom ellipsis/suffix
- Option to break at word boundaries (avoids cutting words in half)
- Type-safe with strict typing

**Use Cases:**

- Long descriptions
- Resume summaries
- Notes in tables
- Preview text

---

### initials

Extracts initials from names for avatar placeholders and compact displays.

**Usage:**

```html
<!-- Default behavior (first 2 initials) -->
<div class="avatar">{{ 'John Doe' | initials }}</div>
<!-- Output: "JD" -->

<!-- Three initials -->
<div class="avatar">{{ 'John Michael Doe' | initials:3 }}</div>
<!-- Output: "JMD" -->

<!-- With uppercase enforcement -->
<div class="avatar">{{ 'john doe' | initials:2:true }}</div>
<!-- Output: "JD" -->

<!-- Real-world example -->
<div class="user-avatar">
  <span>{{ candidate.fullName | initials }}</span>
</div>
```

**Inputs:**

- `value` (string): The full name to extract initials from
- `maxInitials` (number): Maximum number of initials to return (default: 2)
- `uppercase` (boolean): Whether to force uppercase (default: true)

**Features:**

- Extracts initials from multi-word names
- Configurable maximum number of initials
- Option to force uppercase
- Handles edge cases (empty strings, single names)
- Type-safe with strict typing

**Use Cases:**

- Avatar placeholders
- Compact user displays
- Name badges
- User profile initials

---

## Number Formatting Pipes

### percentage

Formats numbers as percentages with custom decimal places.

**Usage:**

```html
<!-- Assessment score (0.856 = 85.6%) -->
<div>Score: {{ 0.856 | percentage }}</div>
<!-- Output: "85.6%" -->

<!-- With 1 decimal place -->
<div>Completion: {{ 0.9234 | percentage:1 }}</div>
<!-- Output: "92.3%" -->

<!-- Already a percentage (85.6) -->
<div>Rate: {{ 85.6 | percentage:1:true }}</div>
<!-- Output: "85.6%" -->

<!-- Without symbol -->
<div>{{ 0.95 | percentage:0:false:false }} complete</div>
<!-- Output: "95 complete" -->

<!-- With space before symbol -->
<div>{{ 0.88 | percentage:1:false:true }}</div>
<!-- Output: "88.0 %" -->
```

**Inputs:**

- `value` (number): The number to format (0-1 for decimal, 0-100 for whole)
- `decimalPlaces` (number): Number of decimal places to show (default: 1)
- `isAlreadyPercentage` (boolean): Whether input is already 0-100 (default: false)
- `includeSymbol` (boolean): Whether to include the % symbol (default: true)
- `spaceBeforeSymbol` (boolean): Whether to add space before % (default: false)

**Features:**

- Handles decimal (0-1) or whole (0-100) number input
- Configurable decimal places
- Optional percentage symbol
- Space before symbol option
- Automatically clamps values between 0 and 100

**Use Cases:**

- Assessment scores
- Completion rates
- Interview success rate
- Progress indicators

---

## Security Pipes

### sanitize

Sanitizes HTML content for safe display, preventing XSS attacks.

**Usage:**

```html
<!-- Sanitize HTML content (default) -->
<div [innerHTML]="candidate.resume | sanitize"></div>

<!-- Sanitize job description -->
<div [innerHTML]="jobDescription | sanitize:'html'"></div>

<!-- Sanitize URL -->
<a [href]="candidate.linkedinUrl | sanitize:'url'">LinkedIn</a>

<!-- Sanitize styles -->
<div [style]="customStyle | sanitize:'style'">Styled content</div>
```

**Inputs:**

- `value` (string): The content to sanitize
- `context` ('html' | 'style' | 'script' | 'url' | 'resourceUrl'): The security context (default: 'html')

**Security Contexts:**

- **html**: Sanitizes HTML content
- **style**: Sanitizes CSS styles
- **script**: Sanitizes scripts
- **url**: Sanitizes URLs
- **resourceUrl**: Sanitizes resource URLs

**Features:**

- Multiple security contexts
- XSS protection
- Integrates with Angular's DomSanitizer
- Type-safe with strict typing

**Security Note:**
This pipe uses Angular's DomSanitizer to prevent XSS attacks. Only use this pipe when displaying trusted or user-generated content that needs to preserve HTML formatting.

**Use Cases:**

- Rich text from resumes
- Job descriptions with HTML formatting
- User-generated content
- External URLs

---

## File Utility Pipes

### fileSize

Formats file sizes from bytes to human-readable format (KB, MB, GB, etc.).

**Usage:**

```html
<!-- Resume file size (2048000 bytes = 2.0 MB) -->
<div>Size: {{ resume.size | fileSize }}</div>
<!-- Output: "2.0 MB" -->

<!-- With custom decimal places -->
<div>{{ document.bytes | fileSize:2 }}</div>
<!-- Output: "1.50 MB" -->

<!-- Using decimal units (1000-based) -->
<div>{{ file.size | fileSize:1:'decimal' }}</div>
<!-- Output: "1.5 MB" -->

<!-- Real-world example -->
<div class="file-info">
  <span>{{ attachment.name }}</span>
  <span class="size">{{ attachment.size | fileSize }}</span>
</div>
```

**Inputs:**

- `value` (number): File size in bytes
- `decimalPlaces` (number): Number of decimal places (default: 1)
- `unitSystem` ('binary' | 'decimal'): Unit system (default: 'binary')

**Unit Systems:**

- **binary** (1024-based): B, KiB, MiB, GiB, TiB, PiB
- **decimal** (1000-based): B, KB, MB, GB, TB, PB

**Features:**

- Automatic unit selection (B, KB, MB, GB, TB)
- Binary (1024) or decimal (1000) unit systems
- Configurable decimal places
- Handles zero and negative values
- Type-safe with strict typing

**Examples:**

- 0 bytes → "0 B"
- 1024 bytes → "1.0 KiB" (binary)
- 1000 bytes → "1.0 KB" (decimal)
- 2048000 bytes → "2.0 MiB" (binary)
- 2048000 bytes → "2.0 MB" (decimal)

**Use Cases:**

- Resume uploads
- Document attachments
- Storage information
- File management

---

## Complete Import Example

To use these pipes in your component:

```typescript
import { Component } from '@angular/core';
import {
  TimeAgoPipe,
  DurationPipe,
  BusinessDaysPipe,
  TruncatePipe,
  InitialsPipe,
  PercentagePipe,
  SanitizePipe,
  FileSizePipe,
} from '@talent-hub/ui';

@Component({
  selector: 'app-candidate-card',
  imports: [TimeAgoPipe, DurationPipe, TruncatePipe, InitialsPipe, PercentagePipe, FileSizePipe],
  template: `
    <div class="candidate-card">
      <div class="avatar">{{ candidate.name | initials }}</div>
      <h3>{{ candidate.name }}</h3>
      <p>{{ candidate.summary | truncate: 100 }}</p>
      <div class="metadata">
        <span>Applied {{ candidate.appliedAt | timeAgo }}</span>
        <span>Score: {{ candidate.score | percentage }}</span>
        <span>Resume: {{ candidate.resumeSize | fileSize }}</span>
      </div>
    </div>
  `,
})
export class CandidateCardComponent {
  // ...component code...
}
```

---

## Best Practices

1. **Performance**: All pipes are marked as `pure: true` for optimal performance
2. **Type Safety**: Use TypeScript types for all pipe parameters
3. **Null Safety**: All pipes handle null/undefined values gracefully
4. **Security**: Always use `sanitize` pipe when displaying user-generated HTML content
5. **Consistency**: Use consistent formatting across your application (e.g., same decimal places for percentages)

---

## Testing

All pipes have comprehensive unit test coverage. Tests are written using Vitest.

### Running Tests

```bash
# Run all pipe tests
npx nx test talent-hub-ui --testPathPattern=pipes

# Run tests with coverage
npx nx test talent-hub-ui --coverage
```

### Test Coverage

| Pipe               | Test File                    | Coverage |
| ------------------ | ---------------------------- | -------- |
| `TimeAgoPipe`      | `time-ago.pipe.spec.ts`      | 100%     |
| `DurationPipe`     | `duration.pipe.spec.ts`      | 100%     |
| `BusinessDaysPipe` | `business-days.pipe.spec.ts` | 100%     |
| `InitialsPipe`     | `initials.pipe.spec.ts`      | 100%     |
| `PercentagePipe`   | `percentage.pipe.spec.ts`    | 100%     |
| `SanitizePipe`     | `sanitize.pipe.spec.ts`      | 100%     |
| `FileSizePipe`     | `file-size.pipe.spec.ts`     | 100%     |

---

## Support

For issues or questions about these pipes, please refer to the inline documentation in each pipe file or contact the Talent Hub development team.
