package com.smart.dao;

import com.smart.domain.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;


/**
 * Created by dlw on 2017/7/18.
 * DAO层只提供最简单的数据操作
 * DAO层不对输入参数做任何检查, 输入参数和业务逻辑的合法性完全由服务层决定
 */
@Repository
public class ItemDao {

    private JdbcTemplate jdbcTemplate;

    //执行替换查找返回list的统一操作, 只能在内部调用
    private List<Item> mulQuery(String sql, Object[] obj) {
        final List<Item> resultList = new LinkedList<Item>();
        //System.out.print("***----------"+sql+"-------***");
        jdbcTemplate.query(sql,obj,
                new RowCallbackHandler() {
                    public void processRow(ResultSet rs) throws SQLException {
                        Item item = new Item();
                        item.setId(rs.getString("id"));
                        item.setLayer(rs.getInt("layer"));
                        item.setName(rs.getString("name"));
                        item.setDescription(rs.getString("description"));
                        resultList.add(item);
                    }
                });
        return resultList;
    }

    /**获取某个层次的所有条目信息
     *
     * @param layer, 层
     * @return
     */
    public List<Item> findByLayer(final int layer) {
        String sql = "SELECT * FROM t_prod WHERE layer=?";
        return mulQuery(sql, new Object[]{layer});
    }

    // 返回单个item,入参id
    public Item findById(final String id){
        String sql = "SELECT * FROM t_prod WHERE id=\""+id+"\"";
        List<Item> list= mulQuery(sql, null);
        if(list.isEmpty()) return null;
        else return list.get(0);
    }

    public List<Item> getAllItem(){
        String sql = "SELECT * FROM t_prod";
        return mulQuery(sql,null);
    }

    /**
     * 获取某个节点id所有的直接子条目, 比如id=2, 那么要获取的就是 2.1,2.2,2.3等, 2.2.1不算
     */
    public List<Item> findDirectSubById(final String pid) {
        System.out.print("findDirectSubById  "+ pid);
        String sql= " SELECT layer FROM t_prod WHERE id=\""+pid+"\"";
        Integer layer = jdbcTemplate.queryForObject(sql,Integer.class);
        if(layer==null) return new LinkedList<Item>(); //如果指定的id不存在,则返回一个空表
        sql = "SELECT * FROM t_prod WHERE id LIKE \""+pid+"%"+"\" and layer=" +(layer+1);
        final List<Item> resultList = new LinkedList<Item>();
        //System.out.println("***----------"+sql+"-------***");
        jdbcTemplate.query(sql,new RowCallbackHandler() {
                    public void processRow(ResultSet rs) throws SQLException {
                        Item item = new Item();
                        item.setId(rs.getString("id"));
                        item.setLayer(rs.getInt("layer"));
                        item.setName(rs.getString("name"));
                        item.setDescription(rs.getString("description"));
                        resultList.add(item);
                    }
                });
        return resultList;
        //return mulQuery(sql1.toString(), new Object[]{pid});
    }




    //增加一个新的Item
    @Transactional
    public void insertItem(Item item){
        String sql = "INSERT INTO t_prod VALUES(?,?,?,?)";
        Object[] args = {item.getId(),item.getLayer(),item.getName(),item.getDescription()};
        jdbcTemplate.update(sql, args);
    }

    /**
     * 根据id来删除当前节点和所有子节点
     * @param pid pid
     */
    @Transactional
    public void deleteItem(final String pid){
        String sql = "DELETE FROM t_prod WHERE id like \"" + pid +"%\"";
        jdbcTemplate.update(sql);
    }

    /**
     * 用newIdPrefix 替换 oldIdPrefix
     * @param oldIdPrefix: 被替换的前缀
     * @param newIdPrefix: 替换后的前缀
     */
    @Transactional
    public void replaceIdPrefix(final String oldIdPrefix, final String newIdPrefix){
        String sql = "update t_prod set id=replace(id,'"+oldIdPrefix+"','"+newIdPrefix+"') where id like '"+oldIdPrefix+"%'";
        ///////System.out.println(sql);
        jdbcTemplate.update(sql);
    }


    /**
     * 修改项目的内容的description
     * @param item:待修改的数据项
     */
    @Transactional
    public void modifyDescription(Item item){
        String sql = "update t_prod set description=\""+item.getDescription()+"\" where id=\""+item.getId()+"\"";
        ///////System.out.println(sql);
        jdbcTemplate.update(sql);
    }

    /**
     * 修改项目内容的name
     * @param item:待修改的数据项
     */
    @Transactional
    public void modifyName(Item item){
        String sql = "update t_prod set name=\""+item.getName()+"\" where id=\""+item.getId()+"\"";
        jdbcTemplate.update(sql);
    }

    /*
        使用Autowired将Spring容器中的jdbcTemplate Bean注入进来
     */
    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
}



