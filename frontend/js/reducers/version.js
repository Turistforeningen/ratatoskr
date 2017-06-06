export default (state = 'uninitialized', action) => (
  action.payload && action.payload.VERSION_TAG
    ? action.payload.VERSION_TAG
    : state
);
