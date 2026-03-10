package = "ical-lib"
version = "0.0-1"
source = {
   url = "https://doctr-local.lbhonra.de/"
}
description = {
   summary = "iCal Parser library written in Lua",
   detailed = [[Please refer to the documentation associated here: https://doctr-local.lbhonra.de/ ]],
   homepage = "https://doctr-local.lbhonra.de/",
   license = "Apache 2.0"
}
dependencies = {}
build = {
   type = "builtin",
   modules = {
      ["ical-lib.ical"] = "src/ical.lua",
   }
}
