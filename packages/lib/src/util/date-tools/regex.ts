export const danishMay = /[Mm]aj /
export const altSeptember = /[Ss]ept /
export const missingDate = /^\w+ \d{4}$/
export const multiDate = /.+;.+/
export const altDate = /.+\(.+\)\s*/
export const yearOnly = /^\d{4}$/
export const beforeMatcher = /^before\s+/i
// format matchers
export const dateFirstMatcher = /\d{1,2} \w{3,9} \d{4}/
export const monthFirstMatcher = /\w{3,9} \d{1,2} \d{4}/
