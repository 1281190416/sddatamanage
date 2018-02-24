package com.smart.dao;

import com.smart.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

/*
    定义一个操作User的DAO Bean
 */
@Repository
public class UserDao {
    private JdbcTemplate jdbcTemplate;

    private final static String MATCH_COUNT_SQL = " SELECT count(*) FROM t_user  " +
            " WHERE name =? and password=? ";

    /**
     * 检查用户名和密码是否匹配
     * @param userName:userName
     * @param password:password
     * @return:boolean
     */
    public int getMatchCount(String userName, String password) {

        return jdbcTemplate.queryForObject(MATCH_COUNT_SQL, new Object[]{userName, password}, Integer.class);
    }

    /*
        根据用户名称返回用户信息
     */
    public User findUserByUserName(final String userName) {
        String sqlStr = " SELECT id,name,isManager "
                + " FROM t_user WHERE name =? ";
        final User user = new User();
        jdbcTemplate.query(sqlStr, new Object[]{userName},
                new RowCallbackHandler() {
                    public void processRow(ResultSet rs) throws SQLException {
                        user.setUserId(rs.getInt("id"));
                        user.setUserName(userName);
                        user.setIsManager(rs.getInt("isManager"));
                    }
                });
        return user;
    }

    /**
     *   查找用户名称是否存在
     * @param userName:userName
     * @return:boolean
     */
    public boolean findUserName(final String userName){
        String sql = "SELECT id FROM t_user where name =\"" + userName +"\"";
        try {
            Integer id = jdbcTemplate.queryForObject(sql, Integer.class);
            if (id != null) return true;
        }
        catch(EmptyResultDataAccessException e){
            return false;
        }
        return false;
    }


    /**
     * 插入新用户
     * @param user:user
     */
    public void insertUser(User user){
        String sql = "INSERT INTO t_user values(?,?,?,?)";
        Object[] args = {user.getUserId(),user.getUserName(),user.getPassword(),user.getIsManager()};
        jdbcTemplate.update(sql, args);
    }


    /*
        使用Autowired将Spring容器中的jdbcTemplate Bean注入进来
     */
    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
}
