set -e

version_command=$@

bump_version() {
  local CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
  npm --no-git-tag-version version $version_command
  cd ${CURRENT_DIR}/src/backend && yarn todo-ci && npm --no-git-tag-version version $version_command
  cd ${CURRENT_DIR}/src/frontend && yarn todo-ci && npm --no-git-tag-version version $version_command
}

if [[ "$version_command" ]]; then
  if type "npm" > /dev/null; then
    bump_version
  fi
fi
