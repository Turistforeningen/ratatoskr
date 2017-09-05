export default (state = 'uninitialized', action) => (
  action.payload && action.payload.HEADER_OPTS
    ? action.payload.HEADER_OPTS.version
    : state
);
