package com.badribhaiapparel.controller;

import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.SettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SettingController {

    private final SettingService settingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> getAllSettings() {
        Map<String, String> settings = settingService.getAllSettings().stream()
                .collect(java.util.stream.Collectors.toMap(
                        com.badribhaiapparel.entity.SystemSetting::getConfigKey, 
                        s -> s.getConfigValue() != null ? s.getConfigValue() : ""
                ));
        return ResponseEntity.ok(ApiResponse.<Map<String, String>>builder()
                .success(true)
                .message("System settings fetched")
                .data(settings)
                .build());
    }

    @GetMapping("/group/{groupName}")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSettingsByGroup(@PathVariable String groupName) {
        return ResponseEntity.ok(ApiResponse.<Map<String, String>>builder()
                .success(true)
                .message("Settings for group " + groupName + " fetched")
                .data(settingService.getSettingsByGroup(groupName))
                .build());
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<Void>> updateSettingsBulk(@RequestBody Map<String, String> settings) {
        settingService.updateSettingsBulk(settings);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Settings updated successfully")
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> updateSetting(@RequestParam String key, @RequestParam String value) {
        settingService.updateSetting(key, value);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Setting " + key + " updated")
                .build());
    }
}
