package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.entity.SystemSetting;
import com.badribhaiapparel.repository.SystemSettingRepository;
import com.badribhaiapparel.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final SystemSettingRepository settingRepository;

    @Override
    public String getSettingValue(String key, String defaultValue) {
        return settingRepository.findByConfigKey(key)
                .map(SystemSetting::getConfigValue)
                .orElse(defaultValue);
    }

    @Override
    @Transactional
    public void updateSetting(String key, String value) {
        SystemSetting setting = settingRepository.findByConfigKey(key)
                .orElse(SystemSetting.builder().configKey(key).build());
        setting.setConfigValue(value);
        settingRepository.save(setting);
    }

    @Override
    public Map<String, String> getSettingsByGroup(String groupName) {
        return settingRepository.findByGroupName(groupName).stream()
                .collect(Collectors.toMap(SystemSetting::getConfigKey, SystemSetting::getConfigValue));
    }

    @Override
    @Transactional
    public void updateSettingsBulk(Map<String, String> settings) {
        settings.forEach(this::updateSetting);
    }

    @Override
    public List<SystemSetting> getAllSettings() {
        return settingRepository.findAll();
    }
}
