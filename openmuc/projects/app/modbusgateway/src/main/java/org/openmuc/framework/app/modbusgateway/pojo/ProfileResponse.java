package org.openmuc.framework.app.modbusgateway.pojo;

import java.util.List;

class ProfileResponse {
    private List<Profile> profiles;

    public List<Profile> getProfiles() {
        return profiles;
    }

    public void setProfiles(List<Profile> profiles) {
        this.profiles = profiles;
    }
}
