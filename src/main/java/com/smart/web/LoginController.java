package com.smart.web;

import com.smart.domain.User;
import com.smart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

import java.util.Map;
/*
	登录请求Controller
 */
@RestController
public class LoginController{
	private UserService userService;

	/*
		这里把截获的/和/index.html请求,返回了login视图,框架解析根据application.properties设置视的view的路径和后缀找到对应的jsp文件login.jsp
		login.jsp把请求转发给了loginCheck.html,会被下面的requestMapping截获
	 */
	@RequestMapping(value = {"/","/index.html","login.html"})
	public ModelAndView loginPage(){
		return new ModelAndView("login");
	}

	/*
		这里截获了/loginCheck.html请求,通过调用UserService的方法来返回不同的视图
	 */
	@RequestMapping(value = "/loginCheck.html")
	public ModelAndView loginCheck(HttpServletRequest request,LoginCommand loginCommand){
		boolean isValidUser =  userService.hasMatchUser(loginCommand.getUserName(),
					                    loginCommand.getPassword());
		//出于安全考虑,这里必须要再判断,前台的jquery只是为了增加用户体验
		//而且这是后台逻辑, 不管前台的
		if (!isValidUser) {
			return new ModelAndView("login", "msg", "用户名或密码错误。");
		} else {
			User user = userService.findUserByUserName(loginCommand
					.getUserName());
			userService.loginSuccess(user);
			request.getSession().setAttribute("user", user);
			return new ModelAndView("main");
		}
	}

	@RequestMapping(value = "/ajaxLoginCheck", method= RequestMethod.POST,produces="application/json;charset=UTF-8")
	@ResponseBody
	public  Map<String, String> ajaxLoginCheck(@RequestBody LoginCommand loginCommand){
		System.out.println("-----------------------------get-----------------");
		System.out.println(loginCommand.getUserName());
		Map<String,String> re = new HashMap<String, String>();
		re.put(String.valueOf("isExist"),
				String.valueOf(userService.isUserNameExist(loginCommand.getUserName())));
		return re;
	}
/*
	@RequestMapping(value = {"/logon.html"})
	public ModelAndView logonPage(){
		return new ModelAndView("logon");
	}
*/
/*
	@RequestMapping(value = "/logonCheck.html")
	public ModelAndView logonCheck(HttpServletRequest request, LogonCommand logonCommand){
		boolean isNameExist = userService.isUserNameExist(logonCommand.getUserName());
		//如果用户名存在或者用户名小于4位
		if(isNameExist || logonCommand.getUserName().length()<4){
			ModelAndView model = new ModelAndView();
			model.setViewName("logon");
			model.addObject("msg","用户名已存在");
			return model;
		}
		else if(!logonCommand.getPassword1().equals(logonCommand.getPassword2())){
			ModelAndView model = new ModelAndView();
			model.setViewName("logon");
			model.addObject("msg","两次密码不同");
			model.addObject("userName",logonCommand.getUserName());
			return model;
		}
		else{
			userService.registerUser(logonCommand.getUserName(),logonCommand.getPassword1());
			return new ModelAndView("login");
		}
	}
*/
	@Autowired
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
}
