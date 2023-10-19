export const example3Wives = `
gantt
    title Patriarch and his wives
    todayMarker off
    dateFormat YYYY-MM-DD
    axisFormat %Y
    
    section Patriarch
    life: 1817-05-03, 1881-07-09

    age 25 | gap 11: milestone,done, 1841-02-28, 1d
    age 30 | gap 19: milestone,done, 1846-01-21, 1d
    age 41 | gap 22: milestone,done, 1857-03-21, 1d
    section Female 1
    life: 1826-01-14, 1891-03-10
    marriage: crit,1841-02-23, 1881-06-01
    age 14 | gap -11: milestone,done, 1841-02-28, 1d

    section Female 2
    life: 1834-04-07, 1870-03-16
    marriage: crit,1846-01-20, 1870-03-16
    age 11 | gap -19: milestone,done, 1846-01-21, 1d

    section Female 3
    life: 1837-10-25, 1898-01-08
    marriage: crit,1857-03-10, 1858-01-01
    age 19 | gap -22: milestone,done, 1857-03-21, 1d
    marriage to Other male: active, 1858-01-01, 1898-01-08
`
