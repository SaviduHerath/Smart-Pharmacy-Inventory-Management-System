package com.pharmacy.controller;

import com.pharmacy.dto.CartRequest;
import com.pharmacy.dto.CartItemResponse;
import com.pharmacy.dto.CartResponse;
import com.pharmacy.entity.Cart;
import com.pharmacy.entity.CartItem;
import com.pharmacy.entity.User;
import com.pharmacy.service.CartService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    // =========================================================
    // GET CURRENT USER
    // =========================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("User is not authenticated");
        }

        if (!(authentication.getPrincipal() instanceof User)) {

            throw new RuntimeException("Invalid authenticated user");
        }

        return (User) authentication.getPrincipal();
    }


    // =========================================================
    // GET CART
    // =========================================================

    /*
     * GET /api/cart
     *
     * Logged-in customer's cart එක ලබාගන්නවා.
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart() {

        User user = getCurrentUser();

        Cart cart =
                cartService.getOrCreateCart(user);

        List<CartItem> items =
                cartService.getCartItems(user);

        BigDecimal total =
                cartService.calculateTotal(user);

        List<CartItemResponse> itemResponses =
                items.stream()
                        .map(CartItemResponse::new)
                        .toList();

        CartResponse response =
                new CartResponse(
                        cart.getId(),
                        user.getId(),
                        itemResponses,
                        total
                );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // ADD TO CART
    // =========================================================

    /*
     * POST /api/cart
     *
     * Add medicine to current user's cart.
     */
    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @Valid @RequestBody CartRequest request
    ) {

        User user = getCurrentUser();

        cartService.addToCart(
                user,
                request.getMedicineId(),
                request.getQuantity()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(buildCartResponse(user));
    }


    // =========================================================
    // UPDATE CART ITEM
    // =========================================================

    /*
     * PUT /api/cart/items/{cartItemId}
     *
     * Update quantity of an existing cart item.
     */
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody CartRequest request
    ) {

        User user = getCurrentUser();

        cartService.updateQuantity(
                user,
                cartItemId,
                request.getQuantity()
        );

        return ResponseEntity.ok(
                buildCartResponse(user)
        );
    }


    // =========================================================
    // REMOVE CART ITEM
    // =========================================================

    /*
     * DELETE /api/cart/items/{cartItemId}
     *
     * Remove one medicine from cart.
     */
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            @PathVariable Long cartItemId
    ) {

        User user = getCurrentUser();

        cartService.removeItem(
                user,
                cartItemId
        );

        return ResponseEntity.ok(
                buildCartResponse(user)
        );
    }


    // =========================================================
    // CLEAR CART
    // =========================================================

    /*
     * DELETE /api/cart/clear
     *
     * Remove all items from current user's cart.
     */
    @DeleteMapping("/clear")
    public ResponseEntity<CartResponse> clearCart() {

        User user = getCurrentUser();

        cartService.clearCart(user);

        return ResponseEntity.ok(
                buildCartResponse(user)
        );
    }


    // =========================================================
    // BUILD CART RESPONSE
    // =========================================================

    private CartResponse buildCartResponse(User user) {

        Cart cart =
                cartService.getOrCreateCart(user);

        List<CartItem> items =
                cartService.getCartItems(user);

        BigDecimal total =
                cartService.calculateTotal(user);

        List<CartItemResponse> itemResponses =
                items.stream()
                        .map(CartItemResponse::new)
                        .toList();

        return new CartResponse(
                cart.getId(),
                user.getId(),
                itemResponses,
                total
        );
    }
}