const User = require("../models/user");
const bcrypt = require("bcryptjs");

const sanitizeUser = (user) => {
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.refreshTokenHash;

    return userObject;
};

const addaddress = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login.",
            });
        }

        const {
            label,
            fullName,
            phone,
            houseNumber,
            street,
            area,
            city,
            state,
            pinCode,
            isDefault,
        } = req.body;

        if (
            !fullName ||
            !phone ||
            !houseNumber ||
            !street ||
            !city ||
            !state ||
            !pinCode
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All address fields (fullName, phone, houseNumber, street, city, state, pinCode) are required.",
            });
        }

        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User account not found or inactive.",
            });
        }

        const shouldBeDefault =
            Boolean(isDefault) || user.addresses.length === 0;

        if (shouldBeDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        const newAddress = {
            label: label ? label.trim() : "Home",
            fullName: fullName.trim(),
            phone: phone.trim(),
            houseNumber: houseNumber.trim(),
            street: street.trim(),
            area: area ? area.trim() : "",
            city: city.trim(),
            state: state.trim(),
            pinCode: pinCode.toString().trim(),
            isDefault: shouldBeDefault,
        };

        user.addresses.push(newAddress);
        await user.save();

        const createdAddress = user.addresses[user.addresses.length - 1];

        return res.status(201).json({
            success: true,
            message: "Delivery address added successfully.",
            address: createdAddress,
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Complete address error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add address.",
        });
    }
};

const getAddresses = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const user = await User.findById(userId).select("addresses isActive");

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User account not found or inactive.",
            });
        }

        return res.status(200).json({
            success: true,
            count: user.addresses.length,
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Get addresses error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve addresses.",
        });
    }
};

const getAddressById = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const user = await User.findById(userId).select("addresses isActive");

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User account not found or inactive.",
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found.",
            });
        }

        return res.status(200).json({
            success: true,
            address,
        });
    } catch (error) {
        console.error("Get address by ID error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve address.",
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User account not found or inactive.",
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found.",
            });
        }

        const {
            label,
            fullName,
            phone,
            houseNumber,
            street,
            area,
            city,
            state,
            pinCode,
            isDefault,
        } = req.body;

        if (label !== undefined) address.label = label.trim();
        if (fullName !== undefined) address.fullName = fullName.trim();
        if (phone !== undefined) address.phone = phone.trim();
        if (houseNumber !== undefined) address.houseNumber = houseNumber.trim();
        if (street !== undefined) address.street = street.trim();
        if (area !== undefined) address.area = area.trim();
        if (city !== undefined) address.city = city.trim();
        if (state !== undefined) address.state = state.trim();
        if (pinCode !== undefined) address.pinCode = pinCode.toString().trim();

        if (isDefault === true) {
            user.addresses.forEach((addr) => {
                if (addr._id.toString() !== addressId) {
                    addr.isDefault = false;
                }
            });
            address.isDefault = true;
        } else if (isDefault === false) {
            address.isDefault = false;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            address,
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Update address error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update address.",
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User account not found or inactive.",
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found.",
            });
        }

        const wasDefault = address.isDefault;

        user.addresses.pull({ _id: addressId });

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully.",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Delete address error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete address.",
        });
    }
};

const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User account not found or inactive.",
            });
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found.",
            });
        }

        user.addresses.forEach((addr) => {
            addr.isDefault = addr._id.toString() === addressId;
        });

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Default delivery address updated.",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Set default address error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to set default address.",
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User not found or account is inactive.",
            });
        }

        return res.status(200).json({
            success: true,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Get user profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile.",
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const { name, phone } = req.body;

        if (!name && !phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide name or phone to update.",
            });
        }

        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User not found or account is inactive.",
            });
        }

        if (name) {
            const trimmedName = name.trim();
            if (trimmedName.length < 2 || trimmedName.length > 60) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be between 2 and 60 characters.",
                });
            }
            user.name = trimmedName;
        }

        if (phone) {
            user.phone = phone.trim();
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Update profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update profile.",
        });
    }
};

const updateUserPreferences = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const {
            favoriteChaiTypes,
            preferredSize,
            sugarPreference,
            milkPreference,
            spicePreference,
        } = req.body;

        const user = await User.findById(userId);

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User not found or account is inactive.",
            });
        }

        if (preferredSize && !["small", "medium", "large"].includes(preferredSize)) {
            return res.status(400).json({
                success: false,
                message: "preferredSize must be one of: small, medium, large.",
            });
        }

        if (
            sugarPreference &&
            !["no-sugar", "less-sugar", "regular"].includes(sugarPreference)
        ) {
            return res.status(400).json({
                success: false,
                message: "sugarPreference must be one of: no-sugar, less-sugar, regular.",
            });
        }

        if (
            spicePreference &&
            !["mild", "medium", "strong"].includes(spicePreference)
        ) {
            return res.status(400).json({
                success: false,
                message: "spicePreference must be one of: mild, medium, strong.",
            });
        }

        if (!user.preferences) {
            user.preferences = {};
        }

        if (favoriteChaiTypes !== undefined) {
            user.preferences.favoriteChaiTypes = Array.isArray(favoriteChaiTypes)
                ? favoriteChaiTypes
                : [favoriteChaiTypes];
        }
        if (preferredSize !== undefined) {
            user.preferences.preferredSize = preferredSize;
        }
        if (sugarPreference !== undefined) {
            user.preferences.sugarPreference = sugarPreference;
        }
        if (milkPreference !== undefined) {
            user.preferences.milkPreference = milkPreference;
        }
        if (spicePreference !== undefined) {
            user.preferences.spicePreference = spicePreference;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Chai preferences updated successfully.",
            preferences: user.preferences,
        });
    } catch (error) {
        console.error("Update preferences error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update preferences.",
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { currentPassword, newPassword } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both current password and new password are required.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long.",
            });
        }

        const user = await User.findById(userId).select("+password isActive");

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User not found or account is inactive.",
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect current password.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        user.refreshTokenHash = undefined; 

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully. Please login again.",
        });
    } catch (error) {
        console.error("Change password error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to change password.",
        });
    }
};

const deactivateAccount = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.isActive = false;
        user.refreshTokenHash = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Account deactivated successfully.",
        });
    } catch (error) {
        console.error("Deactivate account error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to deactivate account.",
        });
    }
};

module.exports = {
    
    addaddress,
    completeaddress: addaddress,
    getAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
    setDefaultAddress,

    getUserProfile,
    updateUserProfile,
    updateUserPreferences,
    changePassword,
    deactivateAccount,
};
