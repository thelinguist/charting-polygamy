---
title: "CSV file format"
---

# CSV file format

If you do not have a GEDCOM, you can construct a CSV file (editable in Excel) manually from historical records. The format is straightforward: one row per life event, with each person and event type listed explicitly.

## Columns

| Column         | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| `Name`         | Full name of the individual the event belongs to                              |
| `Event`        | One of: `Birth`, `Death`, `Marriage`, `Divorce`                               |
| `Date`         | Date in `YYYY-MM-DD` format. Partial dates (`YYYY` or `YYYY-MM`) are accepted |
| `Second Party` | For Marriage and Divorce events: the name of the spouse                       |
| `Note`         | Optional free-text note (e.g. "sealing" or a date range)                      |
| `Source`       | Optional URL or citation for the record                                       |

## Example

Copy and save the following as a `.csv` file to try it out:

```
Name,Event,Date,Second Party,Note,Source
Samuel West,Birth,1820-03-15,,,
Samuel West,Death,1895-07-04,,,
Samuel West,Marriage,1843-04-10,Mary Ann Collins,,
Mary Ann Collins,Birth,1824-08-22,,,
Mary Ann Collins,Death,1891-03-14,,,
Samuel West,Marriage,1854-06-01,Eliza Jane Holt,,
Eliza Jane Holt,Birth,1836-01-11,,,
Eliza Jane Holt,Death,1900-05-07,,,
Samuel West,Marriage,1862-11-20,Ruth Caldwell,,
Ruth Caldwell,Birth,1840-09-30,,,
Ruth Caldwell,Death,1910-12-01,,,
```

The tool will detect that Samuel West had three concurrent marriages and render a plural family chart for him.

## Tips

- Every person who appears as a `Second Party` in a Marriage event should also have their own `Birth` and `Death` rows so their timeline can be drawn accurately.
- If a marriage ended in divorce, add a `Divorce` row with the same two parties. Without an end date the marriage is assumed to have lasted until the wife's death or the patriarch's death, whichever came first.
- Dates do not need to be precise. A year-only date (`1843`) is sufficient for the concurrent-marriage detection to work.
- The `Source` column is ignored by the tool but is useful for your own record-keeping.
