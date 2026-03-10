package = "dctor-lib"
version = "0.0-1"
source = {
   url = "https://api-local.dctor.com/"
}
description = {
   summary = "Dctor application library written in Lua",
   detailed = [[Please refer to the documentation associated here: https://api-local.dctor.com/ ]],
   homepage = "https://api-local.dctor.com/",
   license = "Apache 2.0"
}
dependencies = {}
build = {
   type = "builtin",
   modules = {
      ["dctor-lib.error-utils"] = "src/error-utils.lua",
      ["dctor-lib.route-utils"] = "src/route-utils.lua",
   }
}
