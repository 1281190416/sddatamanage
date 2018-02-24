package com.smart;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.WebApplicationInitializer;

import javax.sql.DataSource;

//@Configuration
//@ComponentScan
//@EnableAutoConfiguration
//上面这3个注解在Spring-boot 1.2+中可以用@SpringBootApplication代替
@SpringBootApplication
//下面这个注解标记开启事务支持,即启用注解事务管理,这个事务支持对用户不透明
//如果想要自定义事务管理器,在main中增加Bean
@EnableTransactionManagement

/*
    在boot中配置MVC环境,启动类Application继承Spring Boot提供的servlet初始化器SpringBootServletInitializer
 */
public class Application  extends SpringBootServletInitializer implements WebApplicationInitializer {

    /*
        添加自定义事务管理器方法txManager,此时SpringBoot会加载自定义的事务管理器,
        不在实例化其他事务管理器
     */
    @Bean
    public PlatformTransactionManager txManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    /*
        重写SpringBootServletInitializer的configure方法
     */
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }


//Spring-boot启动,在main中使用SpringApplication.run
    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }
}

