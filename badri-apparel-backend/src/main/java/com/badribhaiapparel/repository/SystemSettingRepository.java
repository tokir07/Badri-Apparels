package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {
    Optional<SystemSetting> findByConfigKey(String configKey);
    List<SystemSetting> findByGroupName(String groupName);
}
