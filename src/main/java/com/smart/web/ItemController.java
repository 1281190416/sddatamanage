package com.smart.web;

import com.smart.POJO.TreeNode;
import com.smart.domain.Item;
import com.smart.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

/**
 * Created by dlw on 2017/7/19.
 */
@RestController
public class ItemController {
    public ItemService itemService;

    @RequestMapping("/prod/topItem")
    @ResponseBody
    public List<Item> getTopProd(){
        //System.out.print("------------------get request for topItem------------------");
        return   itemService.getTopProd();
    }

    @RequestMapping("/prod/allItem")
    @ResponseBody
    public List<Item> getAllProd(){
        //System.out.print("------------------get request for allItem------------------");
        return   itemService.getAllProd();
    }


    @RequestMapping("/prod/treeItemById")
    @ResponseBody
    public List<Item> getProdTreeById(@RequestBody Item item){
        //System.out.println(item.getId());
        //System.out.print("---------------controller get request for prodtree byid");
        return itemService.getSubItemTree(item.getId());
    }

    @RequestMapping(value = {"/prod/insertItem","/prod/addTopItem"})
    @ResponseBody
    public Map<String,String> insertItem(@RequestBody Item item){
        //System.out.print("---get request for  insert new node---");
        //System.out.println(item);
        HashMap<String,String> re = new HashMap<String, String>();
        if(!itemService.insertItem(item)) re.put("msg","false, item illegal");
        else re.put("msg","insert succeed");
        return re;
    }

    @RequestMapping("/prod/deleteItem")
    @ResponseBody
    public Map<String,String> deleteItem(@RequestBody Item item){
        //System.out.println(item.getId()+" "+item.getLayer()+" "+item.getName()+" "+item.getDescription());//调试输出数据
        HashMap<String,String> re = new HashMap<String, String>();
        if(!itemService.deleteItem(item)) re.put("msg","false, item illegal");
        else re.put("msg","delete succeed");
        return re;
    }


    @RequestMapping("/prod/leafItem")
    @ResponseBody
    public List<Item> getLeaf(@RequestBody Item item){
        //System.out.print("---get request for leaf---");
        return itemService.getLeaf(item.getId());
    }

    @RequestMapping("/prod/ModifyLeaf")
    @ResponseBody
    public Map<String, String> setLeaf(@RequestBody List<Item> li){
        //System.out.println("---get request for setLeaf");
        //System.out.println(li);//仅供测试
        itemService.modifyLeaf(li);
        HashMap<String,String> re = new HashMap<String,String>();
        re.put("msg","modify Leaf Succeed");
        return re;
    }

    @RequestMapping("/prod/ModifyNameDescription")
    @ResponseBody
    public Map<String,String> setNameDescription(@RequestBody Item item){
        HashMap<String,String> re = new HashMap<String, String>();
        if(itemService.modifyNameDescription(item)){
            re.put("msg","modify ND succeed");
        }
        else{
            re.put("msg","modify ND failed");
        }
        return re;
    }



    @Autowired
    public void setItemService(ItemService itemService) {
        this.itemService = itemService;
    }
}
