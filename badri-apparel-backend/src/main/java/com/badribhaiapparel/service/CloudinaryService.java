package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.UploadResultDto;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface CloudinaryService {
    UploadResultDto uploadImage(MultipartFile file, String folder) throws IOException;
    void deleteImage(String publicId) throws IOException;
}
