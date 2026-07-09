package constants

var QUERY_MINIMUM_LIMIT float64 = 1
var QUERY_MAXIMUM_LIMIT float64 = 25

var NO_FILE_UPLOADED_ERROR = "there is no uploaded file associated with the given key"
var RECORD_NOT_FOUND_ERROR = "record not found"

var AnonymousTelNumber = 0000000000

// SATS_PER_CHESS_PUZZLE_WIN is the fixed reward for a first-encounter puzzle win.
// Untyped on purpose: it is assigned to both int and int64 contexts.
const SATS_PER_CHESS_PUZZLE_WIN = 5
