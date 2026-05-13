package com.badribhaiapparel.service;

import com.badribhaiapparel.entity.SystemSetting;
import java.util.List;
import java.util.Map;

public interface SettingService {
    String getSettingValue(String key, String defaultValue);
    void updateSetting(String key, String value);
    Map<String, String> getSettingsByGroup(String groupName);
    void updateSettingsBulk(Map<String, String> settings);
    List<SystemSetting> getAllSettings();
}
