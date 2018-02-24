package com.smart.web;


import com.smart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;


/*
	logon Controller
 */
@RestController
public class LogonController{
    private UserService userService;

    /**
     * 截获logon.html请求
     * @return ModelAndView
     */
    @RequestMapping(value = {"/logon.html"})
    public ModelAndView logonPage(){
        return new ModelAndView("logon");
    }


    /**
     * 注册新用户
     * @param request:http请求
     * @param logonCommand:logonCommand
     * @return ModelAndView
     */
    @RequestMapping(value = "/logonRegister")
    public ModelAndView logonCheck(HttpServletRequest request, LogonCommand logonCommand){
        //把简单的检测长度,验证用户是否存在的工作交给jquery询问后台, 但是为了安全这里还是要判断
        boolean isNameExist = userService.isUserNameExist(logonCommand.getUserName());
        //如果用户名存在或者用户名小于4位
        if(isNameExist || logonCommand.getUserName().length()<6){
            ModelAndView model = new ModelAndView();
            model.setViewName("logon");
            model.addObject("msg","用户名已存在");
            return model;
        }

        else if(!logonCommand.getPassword1().equals(logonCommand.getPassword2())){
            ModelAndView model = new ModelAndView();
            model.setViewName("logon");
            model.addObject("msg","两次密码不同");
            //model.addObject("userName",logonCommand.getUserName());
            return model;
        }
        else{
            userService.registerUser(logonCommand.getUserName(),logonCommand.getPassword1());
            return new ModelAndView("login");
        }
    }

    /**
     * 检查待注册的用户名是否存在
     * @param logonCommand:LogonCommand Object
     * @return: Map<String,String>
     */
    @RequestMapping(value = "/logonCheckUserName", method= RequestMethod.POST,produces="application/json;charset=UTF-8")
    @ResponseBody
    public Map<String, String> ajaxLoginCheck(@RequestBody LogonCommand logonCommand){
        System.out.println("----------------------------get-----------------");
        System.out.println(logonCommand.getUserName());
        Map<String,String> re = new HashMap<String, String>();
        re.put(String.valueOf("isExist"),
                String.valueOf(userService.isUserNameExist(logonCommand.getUserName())));
        return re;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}
