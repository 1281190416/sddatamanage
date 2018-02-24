package com.smart.service;

import java.util.List;
import java.util.LinkedList;
import java.util.Map;

import com.smart.POJO.TreeNode;
import com.smart.domain.Item;
import com.smart.dao.ItemDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by dlw on 2017/7/19.
 * service层需要负责业务逻辑的检查,参数输入的合法检查
 */
@Service
public class ItemService {
    private ItemDao itemDao;

    /**
     * 获取最顶层的Item列表
     * @return List<Item>
     */
    public List<Item> getTopProd(){
        return itemDao.findByLayer(1);
    }

    //返回数据库排列树序的Item
    public List<Item> getAllProd(){return itemDao.getAllItem();}


    //通过顶层节点找到所有的Item
    private List<Item> getChildTree(TreeNode<Item> topNode){
        List<Item> child = itemDao.findDirectSubById(topNode.data.getId());//根据传入的节点topNode找到topNode为根的子树
        List<Item> re = new LinkedList<Item>();
        //System.out.println(topNode);
        for (Item element:child) {
            re.add(element);
            re.addAll(getChildTree(topNode.addChild(element)));//addChild返回的是刚被添加的子节点,在对这个子节点进行递归添加
        }
        return re;
    }




    //根据id找到子树
    public List<Item> getSubItemTree(String id) {
        //System.out.println(id);
        Item item = itemDao.findById(id);
        if(item==null) return new LinkedList<Item>();
        List<Item> re = new LinkedList<Item>();
        re.add(item);
        re.addAll(getChildTree(new TreeNode<Item>(item)));
        //System.out.println(re);
        return re;
    }

    //找到所有leaf
    public List<Item> getLeaf(String rootId){
        //System.out.println(rootId);
        Item item = itemDao.findById(rootId);
        if(item==null) return new LinkedList<Item>();
        List<Item> re = new LinkedList<Item>();
        if(itemDao.findDirectSubById(rootId).isEmpty()){//如果自身不是leaf,返回自身
            re.add(item);
            return re;
        }
        else{
            return getChildLeaf(new TreeNode<Item>(item));//如果有,返回子树的leaf
        }
    }

    public List<Item>  getChildLeaf(TreeNode<Item> topNode){
        List<Item> child = itemDao.findDirectSubById(topNode.data.getId());//找到子节点
        List<Item> re = new LinkedList<Item>();
        if(child.isEmpty()) {
            re.add(topNode.data);//如果没有子节点,则把自身加入,直接结束
            return re;
        }
        for(Item element:child){
            re.addAll(getChildLeaf(topNode.addChild(element)));//返回子树的leaf合集
        }
        return re;
    }




    //插入一个新节点
    public boolean insertItem(Item item){
        if(itemDao.findById(item.getId())!=null) return false;
        int times = 0;
        for(int i = 0; i<item.getId().length(); i++){
            if(item.getId().charAt(i)=='.') times++;
        }
        item.setLayer(times+1);
        itemDao.insertItem(item);
        return true;
    }

    /**
     * 删除某个节点item, 同时调整兄弟节点层
     * @param item: 要删除的item
     * @return false: id不存在,错误
     */
    public boolean deleteItem(Item item){
        //System.out.println("---get delete command----"+item.getId()+"---------");//调试用
        Item dItem = itemDao.findById(item.getId());//从数据库按照id找到这个item
        if(dItem==null) return false;//如果不存在,返回错误
        //System.out.println("---certain Id item exist---");//调试用
        List<Item> sibling;//存储兄弟节点(包含自身)
        if(dItem.getLayer()==1){
            sibling = itemDao.findByLayer(1);//如果当前节点没有父节点,即顶层,比如 1,2,3,4,5,
        }
        else {// 有父节点,比如1.2,3.4.5,2.3.7.2, 注意substring不包含endIndex位置的字符
            sibling = itemDao.findDirectSubById(dItem.getId().substring(0,dItem.getId().lastIndexOf(".")));//通过父节点找到兄弟节点
        }
        //System.out.println(sibling);
        itemDao.deleteItem(dItem.getId());//按照节点删除当前节点
        //System.out.println("---delete succeed---");
        if(sibling.size()>1 && !sibling.get(sibling.size()-1).getId().equals(dItem.getId())){//如果兄弟节点(含自身)个数大于1,且当前节点不在末尾
            itemDao.replaceIdPrefix(sibling.get(sibling.size()-1).getId().substring(0,dItem.getId().length()),
                    dItem.getId());//用末尾兄弟节点来填充删除节点的位置, 这样只要数据库没有再外部操作,可以保证节点是紧密排列的
        }
        return true;
    }

    /**
     *
     * @param li, 输入数据
     * @return {"msg":msg}
     */
    public boolean modifyLeaf(List<Item> li){
        //System.out.println(li);//仅供调试
        for (Item item:li) {
            itemDao.modifyDescription(item);
        }
        return true;
    }

    /**
     * 修改名称和描述
     * @param item:输入数据
     */
     public boolean modifyNameDescription(Item item){
         if(itemDao.findById(item.getId())==null) return false;
         itemDao.modifyName(item);
         itemDao.modifyDescription(item);
         return true;
     }

    @Autowired
    public void setUserDao(ItemDao itemDao) {
        this.itemDao = itemDao;
    }
}
