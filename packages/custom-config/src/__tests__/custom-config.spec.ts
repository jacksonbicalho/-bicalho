import { CustomConfig } from "..";
import { CONFIG_NAME_DEFAULT } from "../constants";

describe("CustomConfig", () => {
  it("Should to be defined CustomConfig", () => {
    expect(CustomConfig).toBeDefined();
  });

  describe("getConfig", () => {
    it("Should return default config ", () => {
      const customConfigName = new CustomConfig().getConfig("name");
      expect(customConfigName).toEqual(CONFIG_NAME_DEFAULT);
    });
  });

  it("Should return settings configured ", () => {
    const customConfig = new CustomConfig();
    const settings = {
      name: "customOne",
      customConfigurations: {
        config1: "value1",
        config2: "value2",
        config3: "value3",
      },
    };
    customConfig.configure(settings);
    expect(customConfig.getConfig()).toEqual(settings);
  });

  describe("configure", () => {
    it("Should return settings configured ", () => {
      const customConfig = new CustomConfig();
      const settings = {
        name: "customOne",
        customConfigurations: {
          config1: "value1",
          config2: "value2",
          config3: "value3",
        },
      };
      customConfig.configure(settings);
      expect(customConfig.getConfig("name")).toEqual(settings.name);
      expect(customConfig.getConfig("customConfigurations")).toEqual(
        settings.customConfigurations,
      );
    });

    it("Should return customConfig [this]", () => {
      const customConfig = new CustomConfig();
      customConfig.configure({
        name: "customSettings",
      });
      expect(customConfig.getConfig("name")).toBe("customSettings");
      expect(customConfig).toBeInstanceOf(CustomConfig);
    });
  });

  describe("execute", () => {
    it("Should to execute function defined", async () => {
      const customConfig = new CustomConfig();
      customConfig.configure({
        name: "customSettingsFN",
        value: 10,
        fnCustom: () => Number(customConfig.getConfig("value")) * 2,
      });
      expect(await customConfig.execute("fnCustom")).toEqual(20);
    });
  });

  describe("constants", () => {
    it("Should to be defined CONFIG_NAME_DEFAULT", () => {
      expect(CONFIG_NAME_DEFAULT).toBeDefined();
    });
  });
});
