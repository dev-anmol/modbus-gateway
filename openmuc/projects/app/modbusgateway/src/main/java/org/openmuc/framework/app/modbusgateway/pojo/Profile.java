package org.openmuc.framework.app.modbusgateway.pojo;

public class Profile {
    private String ProfileName;
    private String DeviceMake;
    private String ProfileModel;
    private String ProfileDescription;
    private int Id;

    // Getters and Setters
    public String getProfileName() {
        return ProfileName;
    }

    public void setProfileName(String profileName) {
        this.ProfileName = profileName;
    }

    public String getDeviceMake() {
        return DeviceMake;
    }

    public void setDeviceMake(String deviceMake) {
        this.DeviceMake = deviceMake;
    }

    public String getProfileModel() {
        return ProfileModel;
    }

    public void setProfileModel(String profileModel) {
        this.ProfileModel = profileModel;
    }

    public String getProfileDescription() {
        return ProfileDescription;
    }

    public void setProfileDescription(String profileDescription) {
        this.ProfileDescription = profileDescription;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        this.Id = id;
    }
}
