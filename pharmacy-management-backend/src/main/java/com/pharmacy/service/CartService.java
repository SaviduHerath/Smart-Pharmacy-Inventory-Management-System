package com.pharmacy.service;

import com.pharmacy.entity.Cart;
import com.pharmacy.entity.CartItem;
import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.User;
import com.pharmacy.repository.CartItemRepository;
import com.pharmacy.repository.CartRepository;
import com.pharmacy.repository.MedicineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MedicineRepository medicineRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            MedicineRepository medicineRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.medicineRepository = medicineRepository;
    }


    // =========================================================
    // GET OR CREATE CART
    // =========================================================

    @Transactional
    public Cart getOrCreateCart(User user) {

        return cartRepository.findByUser(user)
                .orElseGet(() -> {

                    Cart cart = new Cart(user);

                    return cartRepository.save(cart);
                });
    }


    // =========================================================
    // ADD MEDICINE TO CART
    // =========================================================

    @Transactional
    public CartItem addToCart(
            User user,
            Long medicineId,
            Integer quantity
    ) {

        // Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        // Find medicine
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine not found with id: " + medicineId
                        )
                );

        // Check available stock
        if (medicine.getQuantity() < quantity) {
            throw new RuntimeException(
                    "Insufficient stock. Available quantity: "
                            + medicine.getQuantity()
            );
        }

        // Get user's cart
        Cart cart = getOrCreateCart(user);

        // Check whether medicine already exists in cart
        CartItem cartItem =
                cartItemRepository
                        .findByCartAndMedicine(cart, medicine)
                        .orElse(null);

        if (cartItem != null) {

            // Existing quantity + new quantity
            int newQuantity =
                    cartItem.getQuantity() + quantity;

            // Check stock again
            if (medicine.getQuantity() < newQuantity) {
                throw new RuntimeException(
                        "Insufficient stock. Available quantity: "
                                + medicine.getQuantity()
                );
            }

            cartItem.setQuantity(newQuantity);

        } else {

            // New cart item
            cartItem = new CartItem(
                    cart,
                    medicine,
                    quantity,
                    medicine.getUnitPrice()
            );
        }

        return cartItemRepository.save(cartItem);
    }


    // =========================================================
    // GET CART ITEMS
    // =========================================================

    public List<CartItem> getCartItems(User user) {

        Cart cart = getOrCreateCart(user);

        return cartItemRepository.findByCart(cart);
    }


    // =========================================================
    // UPDATE CART ITEM QUANTITY
    // =========================================================

    @Transactional
    public CartItem updateQuantity(
            User user,
            Long cartItemId,
            Integer quantity
    ) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }

        Cart cart = getOrCreateCart(user);

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );

        // Make sure this item belongs to current user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException(
                    "Cart item does not belong to this user"
            );
        }

        Medicine medicine = cartItem.getMedicine();

        // Check stock
        if (medicine.getQuantity() < quantity) {
            throw new RuntimeException(
                    "Insufficient stock. Available quantity: "
                            + medicine.getQuantity()
            );
        }

        cartItem.setQuantity(quantity);

        return cartItemRepository.save(cartItem);
    }


    // =========================================================
    // REMOVE CART ITEM
    // =========================================================

    @Transactional
    public void removeItem(
            User user,
            Long cartItemId
    ) {

        Cart cart = getOrCreateCart(user);

        CartItem cartItem =
                cartItemRepository.findById(cartItemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart item not found"
                                )
                        );

        // Security check
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException(
                    "Cart item does not belong to this user"
            );
        }

        cartItemRepository.delete(cartItem);
    }


    // =========================================================
    // CLEAR CART
    // =========================================================

    @Transactional
    public void clearCart(User user) {

        Cart cart = getOrCreateCart(user);

        cartItemRepository.deleteByCart(cart);
    }


    // =========================================================
    // CALCULATE CART TOTAL
    // =========================================================

    public BigDecimal calculateTotal(User user) {

        Cart cart = getOrCreateCart(user);

        List<CartItem> items =
                cartItemRepository.findByCart(cart);

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : items) {

            BigDecimal itemTotal =
                    item.getUnitPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getQuantity()
                                    )
                            );

            total = total.add(itemTotal);
        }

        return total;
    }
}