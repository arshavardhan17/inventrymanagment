package com.example.demo.services.supplier;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dtos.supplier.CreateSupplierDto;
import com.example.demo.dtos.supplier.UpdateSupplierDto;
import com.example.demo.models.Supplier;
import com.example.demo.repositories.SupplierRepository;
import com.example.demo.repositories.ArticleRepository;
import com.example.demo.models.Article;

@Service
public class SupplierService implements ISupplierService {
    @Autowired
    private final SupplierRepository supplierRepository;
    @Autowired
    private final ArticleRepository articleRepository;

    public SupplierService(SupplierRepository supplierRepository, ArticleRepository articleRepository) {
        this.supplierRepository = supplierRepository;
        this.articleRepository = articleRepository;
    }

    @Override
    public Supplier createSupplier(CreateSupplierDto createDto) {
        Supplier supplier = new Supplier();
        supplier.setName(createDto.getName());
        supplier.setAddress(createDto.getAddress());
        supplier.setContact(createDto.getContact());
        supplier.setPhone(createDto.getPhone());
        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier updateSupplier(UpdateSupplierDto updateDto, Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow();
        supplier.setName(updateDto.getName());
        supplier.setAddress(updateDto.getAddress());
        supplier.setContact(updateDto.getContact());
        supplier.setPhone(updateDto.getPhone());
        return supplierRepository.save(supplier);
    }

    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElseThrow();
    }

    @Override
    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow();
        // Check if supplier has associated articles
        List<Article> articles = articleRepository.findBySupplier(supplier);
        if (!articles.isEmpty()) {
            throw new RuntimeException(
                    "Cannot delete supplier with associated articles. Please delete the articles first.");
        }
        supplierRepository.delete(supplier);
    }
}
