import { sslldev, configServer } from "..";

describe("sslldev", () => {
  it("toBeDefined", () => {
    expect(sslldev).toBeDefined();
  });
  describe("configServer", () => {
    it("shold return value defined", () => {
      configServer.configure({ rootApp: "/pathTo" });
      expect(configServer.getConfig("rootApp")).toEqual("/pathTo");
    });
  });
});
