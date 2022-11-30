import React from 'react';

export const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("questionnaireId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("userId");
    navigate("/login");
}

export const login = (token, questionnaireId, userId, fullName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("questionnaireId", questionnaireId);
    localStorage.setItem("userId", userId);
    if (fullName) {
        localStorage.setItem("fullName", fullName);
    }
}