package com.smart.service;


import com.smart.dao.UserDao;
import com.smart.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

	private UserDao userDao;

	public boolean hasMatchUser(String userName, String password) {
		int matchCount =userDao.getMatchCount(userName, password);
		return matchCount > 0;
	}

	public boolean isUserNameExist(String userName){
		return userDao.findUserName(userName);
	}
	
	public User findUserByUserName(String userName) {
		return userDao.findUserByUserName(userName);
	}

	/**
	 * 留下成功登陆的服务接口
	 * @param user:user
	 */
	@Transactional
    public void loginSuccess(User user) {

	}

	/**
	 * 注册新用户的接口
	 * @param userName:userName
	 * @param password:password
	 * @return:boolean
	 */
	@Transactional
	public boolean registerUser(String userName, String password){
		//User user = findUserByUserName(userName);
		//if(user!=null) return false;
		User user;
		user = new User();
		user.setUserName(userName);
		user.setPassword(password);
		user.setIsManager(0);
		userDao.insertUser(user);
		return true;
	}



	@Autowired
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

}
