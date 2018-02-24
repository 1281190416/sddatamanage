package com.smart.domain;

import java.io.Serializable;
import java.util.Date;

public class User implements Serializable{
	private int userId;

	private String userName;

	private String password;

	private int isManager;


	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getIsManager(){
		return this.isManager;
	}
	public void setIsManager(int isManager){
		this.isManager = isManager;
	}


}
