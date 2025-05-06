module.exports = function () {
  return {
    visitor: {
      Program(path) {
        path.traverse({
          enter(path) {
            if (path.node.leadingComments) {
              path.node.leadingComments = path.node.leadingComments.filter(
                comment => !/^\s*#__PURE__\s*$/.test(comment.value)
              );
            }
          }
        });
      }
    }
  };
}