package com.demo.security;

import java.util.List;
import java.util.Random;

public class FakeDataUtil {

    private static final Random random = new Random();

    private static final List<String> customerNames = List.of(
        "Ravi Kumar", "Sneha Reddy", "Arjun Verma", "Meena Sharma", "Deepak Nair"
    );

    private static final List<String> addresses = List.of(
        "123 MG Road", "456 Jubilee Hills", "789 Banjara Hills", "12 Park Avenue", "34 Green Valley"
    );

    private static final List<String> restaurantNames = List.of(
        "Pizza Palace", "Burger Hut", "Curry Express", "Tandoori Treats", "Noodle Corner"
    );

    private static final List<String> itemPool = List.of(
        "Veg Pizza", "Chicken Biryani", "French Fries", "Paneer Roll", "Spring Rolls", "Ice Cream", "Cold Drink"
    );

    public static String getRandomCustomer() {
        return customerNames.get(random.nextInt(customerNames.size()));
    }

    public static String getRandomAddress() {
        return addresses.get(random.nextInt(addresses.size()));
    }

    public static List<String> getRandomItems() {
        int count = 2 + random.nextInt(3); // 2 to 4 items
        return itemPool.subList(0, count);
    }

    public static String getRandomRestaurant() {
        return restaurantNames.get(random.nextInt(restaurantNames.size()));
    }
    
    public static String getRandomPhone() {
        return "+91" + (long)(Math.random() * 9000000000L + 1000000000L);
    }

}
