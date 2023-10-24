import { describe, it, expect} from "vitest"
import { objectIsMatch } from "../objectIsMatch"

describe('objectIsMatch', () => {
  it('finds match', () => {
    expect(objectIsMatch({ match: 'yes'}, { match: 'yes' })).toBeTruthy()
  })

  it('finds mismatch', () => {
    expect(objectIsMatch({ match: 'yes'}, { match: 'yesterday' })).toBeFalsy()
  })

  it('deals with missing key', () => {
    expect(objectIsMatch({ match: 'yes', missing: undefined }, { match: 'yes', })).toBeTruthy()
    expect(objectIsMatch({ match: 'yes' }, { match: 'yes', missing: undefined })).toBeTruthy()
  })
})
