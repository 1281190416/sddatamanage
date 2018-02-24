package com.smart.domain;

import java.io.Serializable;

/**
 * Created by dlw on 2017/7/18.
 */
public class Item  implements Serializable {

    private String id;
    private int layer;
    private String name;
    private String description;

    /*
        所有的条目都用id, name, description来表示
        比如 layer = 3, id = "1.1.2", name = "杯体", description = "杯子主体";
        比如 layer = 4, id = "1.1.2.1", name = "需要玻璃数量", description = "1Kg";
        比如 layer = 3, id = "1.2.3", name = "说明书", description = "1";
     */
    public int getLayer(){return this.layer;}
    public void setLayer(int layer){this.layer = layer;}
    public String getId(){return this.id;}
    public void setId(String id){this.id = id;}
    public String getName(){return this.name;}
    public void setName(String name){this.name = name;}
    public String getDescription(){return this.description;}
    public void setDescription(String description){this.description = description;}

    @Override
    public String toString(){
        return this.id;
    }
}

